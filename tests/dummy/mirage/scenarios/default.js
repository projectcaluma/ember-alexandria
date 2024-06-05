import { setAllLocales } from "./../factories/helpers";

export default function (server) {
  server.createList("tag", 4);
  server.create("mark", { id: "decision" });
  server.create("mark", { id: "like" });
  server.create("mark", { id: "bill" });

  server.create("category", "withDocuments", {
    name: setAllLocales("Beilagen zum Gesuch"),
    color: "#9CDD69",
  });
  server.create("category", "withDocuments", {
    name: setAllLocales("Nachforderungen"),
    color: "#66CFC9",
  });
  server.create("category", "withDocuments", {
    name: setAllLocales("Beteiligte Behörden"),
    color: "#8791EC",
  });
  server.create("category", "withDocuments", {
    name: setAllLocales("Alle Beteiligten"),
    color: "#CB68C1",
  });
  server.create("category", "withDocuments", {
    name: setAllLocales("Intern"),
    color: "#DB8B72",
  });
}
