import { getOwner, setOwner } from "@ember/application";
import { inject as service } from "@ember/service";

export class ErrorHandler {
  @service notification;
  @service intl;

  constructor(context, error) {
    setOwner(this, getOwner(context));
    this.error = error;
  }

  notify(...args) {
    console.error(this.error);
    if (this.error?.errors?.[0].status === "403") {
      return this.notification.danger(
        this.intl.t("alexandria.errors.no-permission"),
      );
    }

    return this.notification.danger(this.intl.t(...args));
  }
}
