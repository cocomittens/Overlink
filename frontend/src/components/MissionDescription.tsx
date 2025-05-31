import React, { useEffect, useState } from "react";
import { Mission } from "../types/mission";
import "../styles/missions.scss";
import { agentRatings } from "../util/agentRatings"

export function MissionDescription({ mission }: { mission: Mission }) {

  return (
    <div className="description-container">
      <span>Payment for this job is {mission.payment} credits.</span>
      <span>This job has been assigned a difficulty of {mission.difficulty}</span>
      <span>A rating of {agentRatings[mission.minRating]} or above will be sufficient for automatic acceptance.</span>
    </div>
  );
}