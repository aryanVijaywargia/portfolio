import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { gzipSync } from "node:zlib";

import type { BhopalMapData } from "lib/boring/map/types";

import { BHOPAL_MAP_CONFIG, LANDMARK_CONFIG } from "./bhopal.config";
import {
  buildBhopalMap,
  projectCoordinate,
  sha256,
  validateBhopalMap,
  type OsmSnapshot,
} from "./pipeline";

const sourcePath = new URL("../../../data/boring/map/bhopal-central.osm.json", import.meta.url);
const runtimePath = new URL("../../../public/game/maps/bhopal-v1.json", import.meta.url);

const connectedNodeIds = (map: BhopalMapData, startId: string) => {
  const adjacency = new Map(map.vehicleGraph.nodes.map((node) => [node.id, [] as string[]]));
  map.vehicleGraph.edges.forEach((edge) => {
    adjacency.get(edge.from)?.push(edge.to);
    adjacency.get(edge.to)?.push(edge.from);
  });
  const visited = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const current = queue.pop()!;
    (adjacency.get(current) ?? []).forEach((neighbor) => {
      if (visited.has(neighbor)) return;
      visited.add(neighbor);
      queue.push(neighbor);
    });
  }
  return visited;
};

test("projection is stable at the named local origin", () => {
  const origin = projectCoordinate(
    BHOPAL_MAP_CONFIG.origin.latitude,
    BHOPAL_MAP_CONFIG.origin.longitude
  );
  assert.equal(Math.abs(origin[0]), 0);
  assert.equal(Math.abs(origin[1]), 0);
  const east = projectCoordinate(
    BHOPAL_MAP_CONFIG.origin.latitude,
    BHOPAL_MAP_CONFIG.origin.longitude + 0.001
  );
  const north = projectCoordinate(
    BHOPAL_MAP_CONFIG.origin.latitude + 0.001,
    BHOPAL_MAP_CONFIG.origin.longitude
  );
  assert.ok(east[0] > 0);
  assert.ok(north[1] < 0);
});

test("the pinned snapshot builds deterministic, licensed, connected map output", async () => {
  const source = await readFile(sourcePath);
  const snapshot = JSON.parse(source.toString("utf8")) as OsmSnapshot;
  const generatedAt = "2026-01-01T00:00:00.000Z";
  const first = buildBhopalMap(snapshot, sha256(source), generatedAt);
  const second = buildBhopalMap(snapshot, sha256(source), generatedAt);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(validateBhopalMap(first), []);
  assert.equal(first.metadata.attribution, "© OpenStreetMap contributors");
  assert.equal(first.districts.length, 4);
  LANDMARK_CONFIG.forEach(({ id }) => {
    assert.ok(
      first.landmarks.some((landmark) => landmark.id === id),
      `missing ${id}`
    );
  });
  [...first.waters, ...first.greenAreas].forEach((polygon) => {
    assert.ok(polygon.points.length >= 4);
    assert.deepEqual(polygon.points[0], polygon.points[polygon.points.length - 1]);
  });

  const spawn = first.anchors.find((anchor) => anchor.id === "spawn-kamla-park")!;
  const spawnNodeId = `n-${spawn.position[0].toFixed(2)}:${spawn.position[1].toFixed(2)}`;
  const reachable = connectedNodeIds(first, spawnNodeId);
  first.anchors.forEach((anchor) => {
    const nodeId = `n-${anchor.position[0].toFixed(2)}:${anchor.position[1].toFixed(2)}`;
    assert.ok(reachable.has(nodeId), `${anchor.id} is disconnected`);
  });
  assert.ok(reachable.size / first.vehicleGraph.nodes.length > 0.9);
});

test("the committed runtime payload remains inside the two MiB gzip budget", async () => {
  const runtime = await readFile(runtimePath);
  assert.ok(gzipSync(runtime).byteLength <= 2 * 1024 * 1024);
});
