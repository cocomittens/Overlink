import React from "react";
import "../styles/map.scss";
import MapNode from "../components/MapNode";

export default function Map() {
  const posX = 500;
  const posY = 250;
  return (
    <div className="map-container">
      <MapNode active admin top={420} left={300} />
      <MapNode account top={200} left={250} />
    </div>
  );
}
