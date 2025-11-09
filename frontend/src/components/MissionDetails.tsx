import "../styles/missions.scss";

import React from "react";

import { Mission } from "../types/mission";
import { useAtomValue } from "jotai";
import { loadable } from "jotai/utils";
import { currentMissionsAtom } from "../store";

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
          <h1>{mission.title}</h1>
          <div>
            <strong>Employer:</strong> {mission.employer}
          </div>
          <div>
            <strong>Payment:</strong> {mission.payment} credits
          </div>
          <div>
            <strong>Description:</strong>
            <div>{mission.description}</div>
          </div>
        </>
      ) : (
        <h1>Mission {missionId}</h1>
      )}
    </div>
  );
}
