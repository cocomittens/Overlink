import React from "react";
import "../styles/map.scss";

type MapNodeProps = { top: number; left: number };
export default function MapNode({ top, left }: MapNodeProps) {
  return <div className="map-node" style={{ top, left }} />;
}
