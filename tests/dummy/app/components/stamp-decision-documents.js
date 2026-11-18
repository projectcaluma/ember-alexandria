import { service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";

/**
 * Emulates the host app (ebau): stamps the documents in the category
 * "Decision documents" marked for stamping, as ebau does when the decision
 * is submitted. Documents already stamped are skipped.
 */
export default class StampDecisionDocumentsComponent extends Component {
  @service store;
  @service notification;
  @service router;

  stamp = task({ drop: true }, async () => {
    const documents = (
      await this.store.query("document", {
        filter: { categories: "decision-documents", marks: "stamp" },
        include: "files",
      })
    ).filter((document) => !document.isStamped);

    const results = await Promise.allSettled(
      documents.map(async (document) => {
        const file = (await document.files)
          .filter((f) => f.variant === "original")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        await this.store.createRecord("signature", { file }).save();
      }),
    );

    const failed = results.filter((r) => r.status === "rejected");
    failed.forEach((r) => console.error(r.reason));

    if (failed.length) {
      this.notification.danger(
        `${failed.length} of ${results.length} documents could not be stamped.`,
      );
    } else {
      this.notification.success(`${results.length} documents stamped.`);
    }

    this.router.refresh();
  });
}
