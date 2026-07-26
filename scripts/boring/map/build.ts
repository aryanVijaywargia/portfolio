import { gzipSync } from "node:zlib";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildBhopalMap, sha256, validateBhopalMap, type OsmSnapshot } from "./pipeline";

const root = process.cwd();
const sourcePath = path.join(root, "data/boring/map/bhopal-central.osm.json");
const outputDirectory = path.join(root, "public/game/maps");
const outputPath = path.join(outputDirectory, "bhopal-v1.json");

const main = async () => {
  const source = await readFile(sourcePath);
  const snapshot = JSON.parse(source.toString("utf8")) as OsmSnapshot;
  const map = buildBhopalMap(
    snapshot,
    sha256(source),
    snapshot.osm3s?.timestamp_osm_base ?? "pinned-source"
  );
  const errors = validateBhopalMap(map);
  if (errors.length) throw new Error(`Map validation failed:\n- ${errors.join("\n- ")}`);

  const output = `${JSON.stringify(map)}\n`;
  const gzipBytes = gzipSync(output).byteLength;
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, output);

  if (gzipBytes > 2 * 1024 * 1024) {
    throw new Error(`Generated map is ${gzipBytes} bytes gzip, above the 2 MB budget.`);
  }

  console.log(
    `Built ${path.relative(root, outputPath)}: ${map.roads.length} roads, ` +
      `${map.waters.length} water polygons, ${map.landmarks.length} landmarks.`
  );
  console.log(
    `${Buffer.byteLength(output).toLocaleString()} bytes raw / ${gzipBytes.toLocaleString()} gzip.`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
