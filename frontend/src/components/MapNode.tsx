import React from "react";
import "../styles/map.scss";

type MapNodeProps = {
  xPct: number;
  yPct: number;
  name?: string;
  active?: boolean;
  admin?: boolean;
  account?: boolean;
  onClick?: () => void;
};

export default function MapNode({
  xPct,
  yPct,
  name = "",
  active = false,
  admin = false,
  account = false,
  onClick,
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
    <div
      className="map-node-container"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      onClick={onClick}
    >
      <div className={className}></div>
      <span className="map-node-name">{name}</span>
    </div>
  );
}
