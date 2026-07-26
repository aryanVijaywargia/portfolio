import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BHOPAL_MAP_CONFIG, LANDMARK_CONFIG } from "./bhopal.config";

const root = process.cwd();
const dataDirectory = path.join(root, "data/boring/map");
const snapshotPath = path.join(dataDirectory, "bhopal-central.osm.json");
const manifestPath = path.join(dataDirectory, "source-manifest.json");
const endpoint = process.env.OVERPASS_ENDPOINT ?? "https://overpass.kumi.systems/api/interpreter";

const [south, west, north, east] = BHOPAL_MAP_CONFIG.bbox;
const bbox = `${south},${west},${north},${east}`;
const landmarkExpression = LANDMARK_CONFIG.flatMap((landmark) => landmark.patterns)
  .map((pattern) => pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const roadTileDivisions = 4;
const localRoadTiles = Array.from({ length: roadTileDivisions ** 2 }, (_, index) => {
  const row = Math.floor(index / roadTileDivisions);
  const column = index % roadTileDivisions;
  const tileSouth = south + ((north - south) * row) / roadTileDivisions;
  const tileNorth = south + ((north - south) * (row + 1)) / roadTileDivisions;
  const tileWest = west + ((east - west) * column) / roadTileDivisions;
  const tileEast = west + ((east - west) * (column + 1)) / roadTileDivisions;
  return `${tileSouth},${tileWest},${tileNorth},${tileEast}`;
});

const queries = [
  `[out:json][timeout:120];
  (
    way["highway"~"^(motorway|trunk|primary|secondary|tertiary)$"](${bbox});
    way["railway"="rail"](${bbox});
  );
  out body center geom qt;`,
  ...localRoadTiles.map(
    (tile) => `[out:json][timeout:120];
  way["highway"~"^(residential|service)$"](${tile});
  out tags center geom qt;`
  ),
  `[out:json][timeout:120];
  (
    way["natural"="water"](${bbox});
    relation["natural"="water"](${bbox});
    way["waterway"="riverbank"](${bbox});
    way["leisure"~"^(park|nature_reserve|garden)$"](${bbox});
    relation["leisure"~"^(park|nature_reserve|garden)$"](${bbox});
    way["landuse"~"^(forest|grass|recreation_ground|meadow)$"](${bbox});
    relation["landuse"~"^(forest|grass|recreation_ground|meadow)$"](${bbox});
  );
  out body center geom qt;`,
  `[out:json][timeout:120];
  nwr["name"~"${landmarkExpression}",i](${bbox});
  out tags center geom qt;`,
];

const main = async () => {
  const responses: Array<{
    version: number;
    generator: string;
    osm3s?: { timestamp_osm_base?: string; copyright?: string };
    elements: Array<{ type: string; id: number }>;
  }> = [];
  for (let index = 0; index < queries.length; index += 1) {
    const query = queries[index];
    if (index > 0) await new Promise((resolve) => setTimeout(resolve, 2_500));
    let response: Response | null = null;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "user-agent": "aryan-portfolio-map-pipeline/1.0 (offline build step)",
        },
        body: new URLSearchParams({ data: query }),
      });
      if (response.ok || ![429, 502, 503, 504].includes(response.status) || attempt === 4) break;
      const retryAfter = Number(response.headers.get("retry-after")) || attempt * 5;
      console.log(
        `Overpass returned ${response.status}; retrying partition ${index + 1} in ${retryAfter}s.`
      );
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1_000));
    }
    if (!response) throw new Error(`Overpass partition ${index + 1} returned no response`);
    if (!response.ok) {
      throw new Error(
        `Overpass fetch ${index + 1}/${queries.length} failed: ${response.status} ${
          response.statusText
        }`
      );
    }
    responses.push(
      (await response.json()) as {
        version: number;
        generator: string;
        osm3s?: { timestamp_osm_base?: string; copyright?: string };
        elements: Array<{ type: string; id: number }>;
      }
    );
    console.log(`Fetched map partition ${index + 1}/${queries.length}.`);
  }
  const elements = new Map<string, object>();
  responses.forEach((response) => {
    response.elements.forEach((element) => {
      const key = `${element.type}:${element.id}`;
      const previous = elements.get(key);
      if (!previous || JSON.stringify(element).length > JSON.stringify(previous).length) {
        elements.set(key, element);
      }
    });
  });
  const snapshot = {
    version: responses[0].version,
    generator: responses[0].generator,
    osm3s: responses
      .map((response) => response.osm3s)
      .filter(Boolean)
      .sort((a, b) =>
        String(b?.timestamp_osm_base ?? "").localeCompare(String(a?.timestamp_osm_base ?? ""))
      )[0],
    elements: [...elements.values()],
  };
  const text = JSON.stringify(snapshot);
  const checksum = createHash("sha256").update(text).digest("hex");
  const fetchedAt = new Date().toISOString();

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(snapshotPath, `${text.trim()}\n`);
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        fetchedAt,
        endpoint,
        bbox: BHOPAL_MAP_CONFIG.bbox,
        queries,
        sha256: checksum,
        snapshot: path.relative(root, snapshotPath),
      },
      null,
      2
    )}\n`
  );

  console.log(`Pinned ${Buffer.byteLength(text).toLocaleString()} bytes from Overpass.`);
  console.log(`SHA-256 ${checksum}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
