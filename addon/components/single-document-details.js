import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import { DateTime } from "luxon";
import QRCode from "qrcode";
import { trackedFunction } from "reactiveweb/function";
import { localCopy } from "tracked-toolbox";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

const SIGNATURE_POLL_INTERVAL = 3000;

export default class SingleDocumentDetailsComponent extends Component {
  @service("alexandria-documents") documents;
  @service("alexandria-config") config;
  @service("alexandria-side-panel") sidePanel;
  @service intl;
  @service store;
  @service fetch;
  @service notification;

  @tracked editTitle = false;
  @tracked editDescription = false;
  @tracked editDate = false;
  @tracked validTitle = true;
  @tracked signDialogVisible = false;
  @tracked signatureRequest = null;
  @tracked pendingReplacement = null;
  @localCopy("args.document.title") title;
  @localCopy("args.document.description") description;

  originalFilename = trackedFunction(this, async () => {
    if (!this.config.enableOriginalDocumentFilename) {
      return false;
    }

    return (await this.args.document.files)
      .filter((f) => f.variant === "original")
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .pop()?.name;
  });

  // Loads the signature requests of all versions into the store. The
  // template reads them live from the store, so status changes while
  // polling show up right away.
  signatureRequestsLoader = trackedFunction(this, async () => {
    if (!this.config.enableSignatures) {
      return false;
    }
    await this.store.query("signature-request", {
      filter: { document: this.args.document.id },
    });
    return true;
  });

  get signatureRequests() {
    if (!this.signatureRequestsLoader.value) {
      return [];
    }
    return this.store
      .peekAll("signature-request")
      .filter((request) => !request.isNew)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Signatures still contained in the latest file
  get currentSignatureRequests() {
    const fileIds = new Set(this.args.document.hasMany("files").ids());
    return this.signatureRequests.filter(
      (request) => request.isCurrent && fileIds.has(request.fileId),
    );
  }

  // e.g. a registration link that has to be opened on the phone
  actionUrlQrCode = trackedFunction(this, async () => {
    const url = this.signatureRequest?.actionUrl;
    return url ? QRCode.toDataURL(url, { quality: 1 }) : null;
  });

  get locale() {
    return this.intl.primaryLocale.split("-")[0];
  }

  get dateFormat() {
    const defaultFormat = "m/d/Y";
    const formats = { de: "d.m.Y", fr: "d.m.Y", en: defaultFormat };

    return formats[this.locale] ?? defaultFormat;
  }

  get displayWebDAVButton() {
    return (
      this.config.enableWebDAV &&
      this.config.allowedWebDAVMimeTypes.includes(
        this.args.document.latestFile?.value?.mimeType,
      )
    );
  }

  get displayConvertButton() {
    return (
      this.config.enablePDFConversion &&
      [
        "application/vnd.oasis.opendocument.text",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(this.args.document.latestFile?.value?.mimeType)
    );
  }

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.title = title;
  }

  @action updateDocumentDescription({ target: { value: description } }) {
    this.description = description;
  }

  @action async updateDate([date]) {
    this.args.document.date = date
      ? DateTime.fromJSDate(date).toISODate()
      : null;
    await this.saveDocument.perform();
  }

  @action toggle(name) {
    this[name] = !this[name];
    // cancel editing
    if (name === "editTitle" && !this.editTitle) {
      this.title = this.args.document.title;
    } else if (name === "editDescription" && !this.editDescription) {
      this.description = this.args.document.description;
    }
    if (this[name]) {
      this.documents.disableShortcuts();
    } else {
      this.documents.enableShortcuts();
    }
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
    this.editDescription = false;
    this.editDate = false;
    this.documents.enableShortcuts();
  }

  saveDocument = task({ restartable: true }, async (event) => {
    event?.preventDefault();
    try {
      this.args.document.title = this.title;
      this.args.document.description = this.description;
      await this.args.document.save();
      this.resetState();
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      this.args.document.rollbackAttributes();
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  });

  // A new version unrelated to signatures invalidates the current ones
  get replaceInvalidatesSignatures() {
    return (
      this.config.enableSignatures &&
      (this.args.document.isSigned || this.args.document.isStamped)
    );
  }

  @action selectReplacement(event) {
    const [file] = event.target.files;
    // Allow selecting the same file again after cancelling
    event.target.value = "";
    if (!file) {
      return;
    }

    if (this.replaceInvalidatesSignatures) {
      // Confirmed in the dialog
      this.pendingReplacement = file;
      return;
    }

    this.uploadReplacement.perform(file);
  }

  @action confirmReplacement() {
    const file = this.pendingReplacement;
    this.pendingReplacement = null;
    this.uploadReplacement.perform(file);
  }

  @action cancelReplacement() {
    this.pendingReplacement = null;
  }

  uploadReplacement = task({ drop: true }, async (file) => {
    try {
      await this.documents.replace(this.args.document, file);

      if (this.config.enableSignatures) {
        // `is-signed`, `is-stamped` and `is-current` changed
        await this.args.document.reload();
        await this.signatureRequestsLoader.retry();
      }
    } catch (error) {
      new ErrorHandler(this, error).notify(
        "alexandria.errors.replace-document",
      );
    }
  });

  convertDocument = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const modelName = "document";
      const adapter = this.store.adapterFor(modelName);
      const url = adapter.buildURL(modelName, this.args.document.id);
      await this.fetch.fetch(`${url}/convert`, {
        method: "POST",
      });

      this.args.refreshDocumentList();

      this.notification.success(this.intl.t("alexandria.success.convert-pdf"));
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.convert-pdf");
    }
  });

  openWebDAV = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const modelName = "document";
      const adapter = this.store.adapterFor(modelName);
      let url = adapter.buildURL(modelName, this.args.document.id);
      url = url.replace("/documents", "/webdav");
      const response = await this.fetch.fetch(url);

      const webdavUrl = (await response.json()).data.attributes["webdav-url"];

      if (!webdavUrl) {
        throw new Error(this.intl.t("alexandria.errors.open-webdav"));
      }

      window.open(webdavUrl, "_blank");
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.open-webdav");
    }
  });

  copyDocument = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const result = await this.documents.copy([this.args.document.id]);
      if (result.filter((r) => r === true).length > 0) {
        await this.args.refreshDocumentList();
        this.notification.success(
          this.intl.t("alexandria.success.copy-document", { count: 1 }),
        );
      }
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.copy-document", {
        count: 1,
      });
    }
  });

  @action hideSignDialog() {
    // Stops polling only, the backend cleans up after the timeout
    this.signDocument.cancelAll();
    this.resetSignDialog();
  }

  resetSignDialog() {
    this.signDialogVisible = false;
    this.signatureRequest = null;
  }

  signDocument = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const file = this.args.document.latestFile.value;

      // The backend returns the user's active request for the file instead
      // of creating a new one. Reuse it if it is already in the store, a new
      // record with the same id would fail.
      const existing = this.store
        .peekAll("signature-request")
        .find((r) => r.isActive && r.belongsTo("file").id() === file.id);

      if (existing) {
        await existing.reload();
        this.signatureRequest = existing;
      } else {
        this.signatureRequest = this.store.createRecord("signature-request", {
          file,
        });
        await this.signatureRequest.save();
      }

      this.signDialogVisible = true;

      // Every reload makes the backend check the state at the provider
      while (this.signatureRequest.isActive) {
        // eslint-disable-next-line no-await-in-loop
        await timeout(SIGNATURE_POLL_INTERVAL);
        // eslint-disable-next-line no-await-in-loop
        await this.signatureRequest.reload();
      }

      const status = this.signatureRequest.status;
      if (status === "done") {
        // The signed PDF is stored as new version of the document
        await this.args.document.hasMany("files").reload();
        await this.signatureRequestsLoader.retry();
        await this.args.refreshDocumentList?.();
        this.resetSignDialog();
        this.notification.success(this.intl.t("alexandria.success.sign"));
      } else if (status !== "registration_required") {
        // registration_required keeps the dialog open to show the link
        this.resetSignDialog();
        this.notification.danger(
          this.intl.t(`alexandria.errors.sign-${status}`),
        );
      }
    } catch (error) {
      this.signatureRequest?.rollbackAttributes();
      this.resetSignDialog();
      new ErrorHandler(this, error).notify("alexandria.errors.sign-document");
    }
  });
}
