# Offline Bhopal map-data pipeline

The game never calls a geocoder, tile service, Nominatim, or Overpass at runtime. `/boring` loads
the committed static asset at `/game/maps/bhopal-v1.json`.

## Source and licence

- Source: [OpenStreetMap](https://www.openstreetmap.org/copyright), ODbL 1.0.
- Explicit refresh endpoint defaults to `https://overpass.kumi.systems/api/interpreter` and may be
  overridden with `OVERPASS_ENDPOINT`; the exact endpoint is recorded in the manifest.
- Candidate bbox: south `23.20`, west `77.35`, north `23.30`, east `77.47`.
- Projection origin: `23.25 N, 77.41 E`.
- Visible in-game credit: `© OpenStreetMap contributors`, linked to the OSM copyright page.

Garud MP Urban GIS and Bhopal Smart Map are not fetched, scraped, transformed, or shipped. The
[Incredible India Bhopal guide](https://www.incredibleindia.gov.in/en/madhya-pradesh/bhopal) and
[MP Tourism Bhopal guide](https://www.mptourism.com/destination-bhopal.php) were checked on
2026-07-13 only as human orientation references for the lakes, heritage, parks, cultural sites,
and market character. They are not geometry or game-asset sources; all spatial output remains
OSM-derived.

## Rebuild the committed game map (offline)

```sh
pnpm game:map:build
pnpm game:map:validate
```

The build reads only `data/boring/map/bhopal-central.osm.json`. It does not use the network and is
not part of `pnpm build`, so normal application builds cannot silently change the city.

## Explicitly refresh the pinned source (networked)

```sh
pnpm game:map:fetch
pnpm game:map:build
pnpm game:map:validate
```

The fetch step records the complete query, endpoint, UTC fetch time, bbox, snapshot path, and
SHA-256 checksum in `data/boring/map/source-manifest.json`. Review both the source diff and rendered
city before accepting a refresh.

## Runtime schema

`bhopal-v1.json` contains:

- metadata: schema version, source timestamp/checksum, bbox, projection origin/scale, attribution;
- simplified/quantized road and railway lines with stable OSM-derived IDs;
- valid closed water and green-area polygons;
- four named district bounds;
- stable landmark and fictional mission/spawn/recovery anchors;
- vehicle-lane and pedestrian graph seeds.

Coordinates are local metre-like X/Z values. Longitude becomes +X. North becomes -Z. WGS84 deltas
use a local equirectangular approximation at the origin, then a `0.01` world compression factor.
Line simplification is class-specific, coordinates are quantized to `0.01`, duplicate points and
zero-length edges are removed, and polygon output is closed and area-checked.

## Validation and budgets

Automated validation checks projection, determinism, stable IDs, required districts/landmarks,
closed non-zero polygons, non-zero road segments, graph density, and the 2 MB gzip budget. The
renderer derives roads, water, district navigation, landmark proxies, and minimap lines from the
same payload.

If a future payload exceeds 2 MB gzip, do not silently raise the limit. Measure parse/init time on
desktop and a mid-range phone, document the exception here, and get explicit approval.

## Updating safely

1. Run the explicit fetch and inspect `source-manifest.json`.
2. Build twice and verify byte-identical output for the same snapshot.
3. Run tests and validation.
4. Inspect all four districts, both lakes, and every landmark in the debug map.
5. Confirm fictional anchors remain outside sensitive landmark boundaries.
6. Re-record payload size, parse/init time, and visual screenshots.
