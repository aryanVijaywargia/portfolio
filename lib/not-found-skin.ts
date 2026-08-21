/**
 * Which skin the 404 wears.
 *
 * The site ships three designs — the base portfolio at "/", plus the two v2
 * previews at "/signal" and "/graphite" — and a 404 fires on an arbitrary URL,
 * so nothing in the path says which one the visitor was looking at. It is
 * resolved at runtime from the referrer instead, with `?theme=` as an override
 * so a skin can be linked directly.
 */
export type NotFoundSkin = "base" | "signal" | "graphite";

export const NOT_FOUND_SKINS: readonly NotFoundSkin[] = ["base", "signal", "graphite"];

/** Referrer paths that mean "stay in this design". */
export const SKIN_BY_PATH: Record<string, NotFoundSkin> = {
  "/signal": "signal",
  "/graphite": "graphite",
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
  var root = document.documentElement, skin = "base";
  try {
    var known = ${JSON.stringify(SKIN_BY_PATH)};
    var asked = new URLSearchParams(location.search).get("theme");
    if (asked && ${JSON.stringify(NOT_FOUND_SKINS)}.indexOf(asked) !== -1) {
      skin = asked;
    } else if (document.referrer) {
      var from = new URL(document.referrer);
      // Only our own pages get a say; a search engine's referrer means nothing.
      if (from.origin === location.origin) {
        skin = known[from.pathname.replace(/\\/+$/, "")] || "base";
      }
    }
  } catch (e) {}
  root.setAttribute("data-v2", "");
  root.setAttribute("data-v2-variant", skin);
})();`;
