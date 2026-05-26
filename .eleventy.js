// Configuration Eleventy — Tout au Chaud
// Arthur : c'est ici que tu ajouteras filtres, collections et passthrough copies si le projet évolue.

const markdownIt = require("markdown-it");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {

  // ── Shortcode : inline un fichier SVG depuis src/ ────────────────────
  // Usage dans un template : {% svg "logo/logo-complet.svg" %}
  // Inliner le SVG (plutôt que <img>) permet à `fill="currentColor"` de fonctionner.
  eleventyConfig.addShortcode("svg", function (cheminRelatif) {
    const cheminAbsolu = path.join("src", cheminRelatif);
    return fs.readFileSync(cheminAbsolu, "utf-8");
  });

  // ── Support des fichiers de données YAML (.yaml et .yml) ─────────────
  // En Eleventy v3, seul .json est chargé par défaut ; il faut déclarer yaml.
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // ── Fichiers statiques copiés tels quels dans _site/ ─────────────────
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/scripts.js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/logo");

  // ── Filtre : convertit du Markdown en HTML (utilisé pour la biographie)
  // Les <p> reçoivent la classe "corps-texte" pour correspondre au CSS existant.
  const md = new markdownIt({ html: false, breaks: false, linkify: false });

  const renderParDefaut = md.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrSet("class", "corps-texte");
    return renderParDefaut(tokens, idx, options, env, self);
  };

  eleventyConfig.addFilter("markdownify", (contenu) => {
    if (!contenu) return "";
    return md.render(String(contenu));
  });

  // ── Filtre : formate un entier en chaîne sur 2 chiffres (ex : 1 → "01")
  eleventyConfig.addFilter("zerofill", (num) => String(num).padStart(2, "0"));

  // ── Collection : pièces triées par le champ "ordre" ───────────────────
  // Arthur : pour ajouter une nouvelle catégorie de pièces, duplique ce bloc
  // en changeant le glob et le nom de la collection.
  eleventyConfig.addCollection("pieces", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/pieces/*.md")
      .sort((a, b) => (a.data.ordre || 0) - (b.data.ordre || 0));
  });

  // ── Configuration Eleventy ────────────────────────────────────────────
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
