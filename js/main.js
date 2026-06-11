class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-inner">
        <a href="index.html" class="site-title">🍄 Mycofall – Wiki</a>
        <nav class="main-nav">
          <a href="story.html" data-page="story" class="wip">Story</a>
          <a href="characters.html" data-page="characters">Characters &amp; Perksets</a>
          <a href="perks.html" data-page="perks">In-Game Perks</a>
          <a href="skills.html" data-page="skills">Skills</a>
          <a href="artifacts.html" data-page="artifacts">Artifacts</a>
          <a href="enemies.html" data-page="enemies">Enemies</a>
          <a href="maps.html" data-page="maps">Maps</a>
          <a href="achievements.html" data-page="achievements" class="wip">Achievements</a>
        </nav>
      </div>
    `;

    const page = document.body.dataset.page;
    if (page) {
      const link = this.querySelector(`.main-nav a[data-page="${page}"]`);
      if (link) link.classList.add("active");
    }
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <p><a href="https://store.steampowered.com/app/3701190/Mycofall/" target="_blank" rel="noopener">Mycofall on Steam</a> · Copyright (c) 2026 Lazy KodKod Games · Last updated: 2026-06-11</p>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

document.addEventListener("DOMContentLoaded", () => {
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
