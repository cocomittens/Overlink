import "../styles/missions.scss";

import { Mission } from "../types/mission";
import React from "react";
import { currentMissionsAtom } from "../store";
import { loadable } from "jotai/utils";
import { useAtomValue } from "jotai";

export function MissionDetails({ missionId }: { missionId: number | null }) {
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const currentMissions: Mission[] =
    currentMissionsLoadable.state === "hasData"
      ? currentMissionsLoadable.data
      : [];

  const mission =
    missionId !== null
      ? currentMissions.find((m) => m.id === missionId) ?? null
      : null;

  if (missionId !== null && currentMissionsLoadable.state === "loading") {
    return <div className="details-container">Loading mission…</div>;
  }

  if (missionId === null) return null;

  return (
    <div className="details-container">
      {mission ? (
        <>
          <div className="mission-info">
            <div className="header">Mission</div>
            <div className="small-field">{mission.title}</div>
            <div className="small-field">
              <strong>Employer:</strong> {mission.employer}
            </div>
            <div className="small-field">
              <strong>Payment:</strong> {mission.payment} credits
            </div>
            <div className="large-field">
              <strong>Description:</strong>
              <div>{mission.description}</div>
            </div>
          </div>
          <div className="action-buttons">
            <div className="button">Close</div>
            <div className="button">Reply</div>
            <div className="button">Abandon</div>
          </div>
        </>
      ) : (
        <h1>Mission {missionId}</h1>
      )}
    </div>
  );
}
