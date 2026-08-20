/**
 * Routes rendered by the v2 design.
 *
 * These pages supply their own header, footer and ambient chrome, so the app
 * shell in pages/_app skips the v1 equivalents for them.
 */
export const V2_ROUTES: ReadonlySet<string> = new Set(["/signal", "/graphite"]);

export const isV2Route = (pathname: string): boolean => V2_ROUTES.has(pathname);
