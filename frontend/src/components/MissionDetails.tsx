import "../styles/missions.scss";

import React, { useEffect, useState } from "react";

import { Mission } from "../types/mission";

export function MissionDetails({ missionId }: { missionId: number | null }) {
  return (
    <div>
      {missionId !== null && (
        <div className="details-container">
          <h1>Mission {missionId}</h1>
        </div>
      )}
    </div>
  );
}
