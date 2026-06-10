document.addEventListener("DOMContentLoaded", () => {
  // Aktiven Navigationspunkt hervorheben
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(".main-nav a").forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
    });
  }

  // Generischer Tabellen-Suchfilter:
  // <input data-table-search="#meine-tabelle"> filtert die <tbody>-Zeilen
  // der referenzierten Tabelle nach dem eingegebenen Text.
  document.querySelectorAll("[data-table-search]").forEach((input) => {
    const table = document.querySelector(input.dataset.tableSearch);
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      rows.forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  });
});
