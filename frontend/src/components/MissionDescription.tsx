import "../styles/missions.scss";

import React from "react";

import { Mission } from "../types/mission";

export function MissionDescription({ mission }: { mission: Mission | null }) {
  return (
    <div className="description-container">
      {mission && (
        <>
          <span>Payment for this job is {mission.payment} credits.</span>
          <span>
            This job has been assigned a difficulty of {mission.difficulty}
          </span>
          <span>You must be level {mission.minRating} or above to accept.</span>
        </>
      )}
    </div>
  );
}
