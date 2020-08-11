export default function (server) {
  server.create("category", "withDocuments", {
    name: "Beilagen zum Gesuch",
    color: "#9CDD69",
  });
  server.create("category", "withDocuments", {
    name: "Nachforderungen",
    color: "#66CFC9",
  });
  server.create("category", "withDocuments", {
    name: "Beteiligte Behörden",
    color: "#8791EC",
  });
  server.create("category", "withDocuments", {
    name: "Alle Beteiligten",
    color: "#CB68C1",
  });
  server.create("category", "withDocuments", {
    name: "Intern",
    color: "#DB8B72",
  });
}
