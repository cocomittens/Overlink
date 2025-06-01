import React from "react";
import "../styles/map.scss";

type MapNodeProps = {
  top: number;
  left: number;
  active?: boolean;
  admin?: boolean;
  account?: boolean;
};
export default function MapNode({
  top,
  left,
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
  return <div className={className} style={{ top, left }} />;
}
