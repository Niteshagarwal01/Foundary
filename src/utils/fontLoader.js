/**
 * Dynamic font loader — injects Google Fonts <link> on demand.
 * Prevents loading 500 fonts at page load; only loads what's needed.
 */
const loaded = new Set();

export function loadFont(family, weights = [400, 700], italic = false) {
  const key = `${family}-${italic}`;
  if (loaded.has(key)) return;
  loaded.add(key);

  const fam = family.replace(/\s+/g, "+");
  let query;
  if (italic) {
    const w = weights.map((w) => `0,${w};1,${w}`).join(";");
    query = `ital,wght@${w}`;
  } else {
    query = `wght@${weights.join(";")}`;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fam}:${query}&display=swap`;
  document.head.appendChild(link);
}

export function preloadFonts(families) {
  families.forEach(({ family, weights, italic }) =>
    loadFont(family, weights || [400, 700], italic || false)
  );
}
