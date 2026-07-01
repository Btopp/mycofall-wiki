class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-inner">
        <a href="index.html" class="site-title">🍄 Mycofall – Wiki</a>
        <nav class="main-nav">
          <a href="game.html" data-page="game" class="wip" data-i18n="Codex:Mycofall.title">Game</a>
          <a href="characters.html" data-page="characters" data-i18n="Codex:Character.title">Characters</a>
          <a href="skills.html" data-page="skills" data-i18n="Codex:Skill.title">Skills</a>
          <a href="perks.html" data-page="perks" data-i18n="Codex:Perk.title">Perks</a>
          <a href="resources.html" data-page="resources" data-i18n="Codex:Resource.title">Resources</a>
          <a href="artifacts.html" data-page="artifacts" data-i18n="Codex:Artifact.title">Artifacts</a>
          <a href="interactables.html" data-page="interactables" data-i18n="Codex:Interactable.title">Interactables</a>
          <a href="enemies.html" data-page="enemies" data-i18n="Codex:Enemy.title">Enemies</a>
          <a href="maps.html" data-page="maps" data-i18n="Codex:Map.title">Maps</a>
          <a href="achievements.html" data-page="achievements">Achievements</a>
        </nav>
        <div class="header-controls">
          <select id="wiki-lang" aria-label="Language">
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
            <option value="ru">RU</option>
            <option value="zh">简体中文</option>
            <option value="ja">JA</option>
          </select>
          <button id="wiki-theme" aria-label="Toggle dark mode">🌙</button>
        </div>
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
      <p>Copyright © 2026 Lazy KodKod Games · <a href="https://store.steampowered.com/app/3701190/Mycofall/" target="_blank" rel="noopener">Mycofall on Steam</a> · <a href="https://mycofall.com/imprint/">Imprint</a></p>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

// ─── Theme (Dark / Light) ───

const darkMq = window.matchMedia("(prefers-color-scheme: dark)");

function getEffectiveTheme() {
  const saved = localStorage.getItem("wiki-theme");
  if (saved === "dark" || saved === "light") return saved;
  return darkMq.matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById("wiki-theme");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("wiki-theme");
  if (saved) {
    applyTheme(saved);
  } else {
    applyTheme(getEffectiveTheme());
    document.documentElement.removeAttribute("data-theme");
  }

  darkMq.addEventListener("change", () => {
    if (!localStorage.getItem("wiki-theme")) {
      applyTheme(darkMq.matches ? "dark" : "light");
      document.documentElement.removeAttribute("data-theme");
    }
  });
}

initTheme();

// ─── i18n Language Switching ───

const supportedLangs = ["en", "de", "fr", "es", "ru", "zh", "ja"];

let wikiI18nData = null;

function loadI18nData() {
  const shared = window.WIKI_I18N || {};
  const el = document.getElementById("wiki-i18n");
  if (!el) return Object.keys(shared).length ? shared : null;

  let inline = {};
  try { inline = JSON.parse(el.textContent) || {}; } catch {}

  for (const locale in inline) {
    if (!shared[locale]) shared[locale] = {};
    Object.assign(shared[locale], inline[locale]);
  }
  return Object.keys(shared).length ? shared : null;
}

function detectSystemLanguage() {
  const browserLang = navigator.language || "";
  for (const lang of supportedLangs) {
    if (browserLang.startsWith(lang)) return lang;
  }
  const prefix = browserLang.split("-")[0];
  for (const lang of supportedLangs) {
    if (lang.startsWith(prefix)) return lang;
  }
  return "en";
}

function switchLanguage(lang) {
  if (!wikiI18nData) wikiI18nData = loadI18nData();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const useHtml = el.hasAttribute("data-i18n-html");

    if (!el.dataset.i18nDefault) {
      el.dataset.i18nDefault = useHtml ? el.innerHTML : el.textContent;
    }

    if (lang === "en") {
      if (useHtml) el.innerHTML = el.dataset.i18nDefault;
      else el.textContent = el.dataset.i18nDefault;
      return;
    }

    const langData = wikiI18nData && wikiI18nData[lang];
    const translated = langData && langData[el.dataset.i18n];
    if (translated) {
      if (useHtml) el.innerHTML = translated;
      else el.textContent = translated;
    } else {
      if (useHtml) el.innerHTML = el.dataset.i18nDefault;
      else el.textContent = el.dataset.i18nDefault;
    }
  });

  localStorage.setItem("wiki-lang", lang);
  document.documentElement.lang = lang;
}

// ─── DOMContentLoaded ───

document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("wiki-theme");
  if (themeBtn) {
    themeBtn.textContent = getEffectiveTheme() === "dark" ? "☀️" : "🌙";
    themeBtn.addEventListener("click", () => {
      const next = getEffectiveTheme() === "dark" ? "light" : "dark";
      localStorage.setItem("wiki-theme", next);
      applyTheme(next);
    });
  }

  const savedLang = localStorage.getItem("wiki-lang") || detectSystemLanguage();
  const langSelect = document.getElementById("wiki-lang");

  if (langSelect) {
    langSelect.value = savedLang;
    if (savedLang !== "en") switchLanguage(savedLang);

    langSelect.addEventListener("change", (e) => {
      switchLanguage(e.target.value);
    });
  }

  document.querySelectorAll("[data-table-search]").forEach((input) => {
    const table = document.querySelector(input.dataset.tableSearch);
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      rows.forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(query)
          ? ""
          : "none";
      });
    });
  });
});
