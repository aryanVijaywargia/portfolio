/**
 * Which skin the 404 wears.
 *
 * The public portfolio uses the graphite skin at "/"; the earlier portfolio
 * now lives at "/graphite", and the signal variant remains at "/signal".
 * A 404 can be opened directly, so the current path is considered before the
 * referrer, with `?theme=` available as an explicit override.
 */
export type NotFoundSkin = "base" | "signal" | "graphite";

export const NOT_FOUND_SKINS: readonly NotFoundSkin[] = ["base", "signal", "graphite"];

/** Referrer paths that mean "stay in this design". */
export const SKIN_BY_PATH: Record<string, NotFoundSkin> = {
  "/": "graphite",
  "/signal": "signal",
  "/graphite": "base",
};

/**
 * Runs from an inline <script> in the document head, before first paint, so the
 * page never renders one skin and then swaps to another. It writes the result
 * onto <html>; the page inherits the tokens from there rather than stamping a
 * variant of its own, which would beat what this resolved.
 *
 * Kept as a plain string because it is serialised into the page — it cannot
 * close over anything, and it must not throw on a browser that lacks URL().
 */
export const NOT_FOUND_SKIN_SCRIPT = `(function(){
  var root = document.documentElement, skin = "graphite";
  try {
    var known = ${JSON.stringify(SKIN_BY_PATH)};
    var asked = new URLSearchParams(location.search).get("theme");
    if (asked && ${JSON.stringify(NOT_FOUND_SKINS)}.indexOf(asked) !== -1) {
      skin = asked;
    } else if (location.pathname === "/graphite" || location.pathname.indexOf("/graphite/") === 0) {
      skin = "base";
    } else if (location.pathname === "/signal" || location.pathname.indexOf("/signal/") === 0) {
      skin = "signal";
    } else if (document.referrer) {
      var from = new URL(document.referrer);
      // Only our own pages get a say; a search engine's referrer means nothing.
      if (from.origin === location.origin && known[from.pathname.replace(/\\/+$/, "")]) {
        skin = known[from.pathname.replace(/\\/+$/, "")];
      }
    }
  } catch (e) {}
  root.setAttribute("data-v2", "");
  root.setAttribute("data-v2-variant", skin);
})();`;
