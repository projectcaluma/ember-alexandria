import { getOwner, setOwner } from "@ember/application";
import { service } from "@ember/service";

export class ErrorHandler {
  @service notification;
  @service intl;

  constructor(context, error) {
    setOwner(this, getOwner(context));
    this.error = error;
  }

  notify(...args) {
    console.error(this.error);

    const firstError = this.error?.errors?.[0];

    if (firstError?.status === "403") {
      return this.notification.danger(
        this.intl.t("alexandria.errors.no-permission"),
      );
    } else if (firstError?.status === "413") {
      return this.notification.danger(
        this.intl.t("alexandria.errors.file-too-large"),
      );
    } else if (
      firstError?.status === "400" &&
      firstError?.source.pointer === "/data"
    ) {
      // Root level validation errors should be displayed directly from the
      // backend to allow proper custom validation
      return this.notification.danger(firstError.detail);
    }

    if (args.length) {
      return this.notification.danger(this.intl.t(...args));
    }
  }
}
