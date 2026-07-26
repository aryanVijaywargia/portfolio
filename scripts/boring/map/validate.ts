import { gzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { BhopalMapData } from "lib/boring/map/types";
import { validateBhopalMap } from "./pipeline";

const main = async () => {
  const filePath = path.join(process.cwd(), "public/game/maps/bhopal-v1.json");
  const source = await readFile(filePath);
  const map = JSON.parse(source.toString("utf8")) as BhopalMapData;
  const errors = validateBhopalMap(map);
  const gzipBytes = gzipSync(source).byteLength;
  if (gzipBytes > 2 * 1024 * 1024) errors.push(`Gzip payload exceeds 2 MB: ${gzipBytes} bytes`);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    `Map valid: ${gzipBytes.toLocaleString()} gzip bytes, ${
      map.vehicleGraph.edges.length
    } lane edges.`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
