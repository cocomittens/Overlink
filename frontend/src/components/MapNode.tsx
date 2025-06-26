import React from "react";
import "../styles/map.scss";

type MapNodeProps = {
  top: number;
  left: number;
  name?: string;
  active?: boolean;
  admin?: boolean;
  account?: boolean;
  onClick?: () => void;
};

export default function MapNode({
  top,
  left,
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
    <div className="map-node-container" onClick={onClick}>
      <div
        className={className}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
      <span
        className="map-node-name"
        style={{
          top: `${top}%`,
          left: `calc(${left}% + 12px)`,
        }}
      >
        {name}
      </span>
    </div>
  );
}
