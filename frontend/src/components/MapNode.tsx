import React from "react";
import "../styles/map.scss";

type MapNodeProps = { top: number; left: number; active?: boolean };
export default function MapNode({ top, left, active = false }: MapNodeProps) {
  const className = `map-node${active ? " active" : ""}`;
  return <div className={className} style={{ top, left }} />;
}
