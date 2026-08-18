import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { Mime } from "mime/lite";
import otherTypes from "mime/types/other.js";
import standardTypes from "mime/types/standard.js";

export default class AlexandriaConfigService extends Service {
  namespace = undefined;
  zipDownloadHost = undefined;
  zipDownloadNamespace = undefined;

  enablePDFConversion = false;
  enableWebDAV = false;
  enableOriginalDocumentFilename = false;
  allowedWebDAVMimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  additionalFileTypes = {};
  enableMoveCopyFallback = true;
  markIcons = {};
  customMimeTypes = {
    "application/vnd.ms-outlook": ["msg"],
  };

  /**
   * Mime instance which, in addition to the standard types, knows the mime
   * types configured in `customMimeTypes`.
   *
   * @returns {Mime} The configured mime instance
   */
  get mime() {
    return new Mime(standardTypes, otherTypes).define(
      this.customMimeTypes,
      true,
    );
  }

  get documentListColumns() {
    return {
      type: {
        label: "type",
        labelHidden: true,
      },
      title: {
        label: "document-title",
        sort: true,
      },
      marks: {
        label: "marks",
        labelHidden: true,
      },
      date: {
        label: "date",
        sort: true,
      },
      modifiedAt: {
        label: "modified-at",
        sort: true,
        sortKey: "modified_at",
      },
      createdByUser: {
        label: "created-by-user",
        sort: true,
        sortKey: "created_by_user",
      },
      createdByGroup: {
        label: "created-by-group",
        sort: true,
        sortKey: "created_by_group",
      },
    };
  }

  get searchListColumns() {
    return {
      type: {
        label: "type",
        labelHidden: true,
      },
      title: {
        label: "document-title",
      },
      marks: {
        label: "marks",
        labelHidden: true,
      },
      link: {
        label: "link",
        labelHidden: true,
      },
      date: {
        label: "date",
      },
      modifiedAt: {
        label: "modified-at",
      },
      createdByUser: {
        label: "created-by-user",
      },
      createdByGroup: {
        label: "created-by-group",
      },
    };
  }

  @tracked alexandriaQueryParams = {};

  /**
   * The active group is used for the createdByGroup property when creating new
   * documents and files. This is important as a user can be in multiple groups.
   */
  @tracked activeGroup = null;

  /**
   * Defaults so we can lookup
   * `this.config.modelMetaFilters.document`
   * without an exeption on modelMetaFilters.
   */
  get modelMetaFilters() {
    return {};
  }

  get categoryQueryParameters() {
    return {};
  }

  get defaultModelMeta() {
    return {};
  }

  get suggestedTagsFilters() {
    return {};
  }

  resolveUser(id) {
    return id;
  }

  resolveGroup(id) {
    return id;
  }

  documentsPostProcess(documents) {
    return documents;
  }

  documentListLinkTo(document) {
    return {
      route: "index",
      label: document.title,
    };
  }
}
