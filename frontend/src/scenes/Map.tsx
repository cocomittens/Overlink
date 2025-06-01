import React from "react";
import "../styles/map.scss";
import MapNode from "../components/MapNode";

export default function Map() {
  // example position values in pixels
  const posX = 100;
  const posY = 150;
  return (
    <div className="map-container">
      <MapNode top={posY} left={posX} />
    </div>
  );
}
