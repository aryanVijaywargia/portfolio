export type Point2 = [number, number];

export type MapFeatureLine = {
  id: string;
  name?: string;
  className: string;
  width: number;
  points: Point2[];
};

export type MapFeaturePolygon = {
  id: string;
  name?: string;
  className: string;
  points: Point2[];
};

export type DistrictId = "lakefront" | "old-city" | "shyamla-hills" | "new-bhopal";

export type MapDistrict = {
  id: DistrictId;
  name: string;
  shortName: string;
  center: Point2;
  bounds: Point2[];
  accent: string;
};

export type LandmarkKind =
  | "lake"
  | "mosque"
  | "palace"
  | "market"
  | "museum"
  | "cultural"
  | "park"
  | "memorial"
  | "temple"
  | "station"
  | "mall"
  | "overlook";

export type MapLandmark = {
  id: string;
  name: string;
  kind: LandmarkKind;
  districtId: DistrictId;
  position: Point2;
  sensitive: boolean;
  source: "osm" | "curated-osm-anchor";
};

export type AnchorKind = "spawn" | "mission" | "recovery" | "overlook";

export type MapAnchor = {
  id: string;
  label: string;
  kind: AnchorKind;
  districtId: DistrictId;
  position: Point2;
};

export type GraphNode = {
  id: string;
  position: Point2;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  width: number;
};

export type NavigationGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type BhopalMapData = {
  metadata: {
    schemaVersion: 1;
    generatedAt: string;
    sourceDate: string;
    sourceChecksum: string;
    sourceUrl: string;
    bbox: [number, number, number, number];
    origin: { latitude: number; longitude: number; label: string };
    worldScale: number;
    worldBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
    attribution: string;
    licenseUrl: string;
  };
  roads: MapFeatureLine[];
  railways: MapFeatureLine[];
  waters: MapFeaturePolygon[];
  greenAreas: MapFeaturePolygon[];
  districts: MapDistrict[];
  landmarks: MapLandmark[];
  anchors: MapAnchor[];
  vehicleGraph: NavigationGraph;
  pedestrianGraph: NavigationGraph;
};
