import React from "react";
import "../styles/map.scss";

type MapNodeProps = {
  top: number;
  left: number;
  name?: string;
  active?: boolean;
  admin?: boolean;
  account?: boolean;
};
export default function MapNode({
  top,
  left,
  name = "",
  active = false,
  admin = false,
  account = false,
}: MapNodeProps) {
  const className = [
    "map-node",
    active ? "active" : null,
    admin ? "admin" : null,
    account ? "account" : null,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="map-node-container">
      <div className={className} style={{ top, left }}></div>
      <span className="map-node-name" style={{ top: top - 8, left: left + 16 }}>
        {name}
      </span>
    </div>
  );
}
