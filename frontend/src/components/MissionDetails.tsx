import "../styles/missions.scss";

import { Mission } from "../types/mission";
import React from "react";
import { currentMissionsAtom } from "../store";
import { loadable } from "jotai/utils";
import { useAtomValue } from "jotai";

export function MissionDetails({
  missionId,
  onClose,
}: {
  missionId: number | null;
  onClose: () => void;
}) {
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

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

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
            <div
              className="mission-action"
              onClick={handleClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClose(e);
                }
              }}
            >
              <span>Close</span>
            </div>
            <div className="mission-action">
              <span>Reply</span>
            </div>
            <div className="mission-action">
              <span>Abandon</span>
            </div>
          </div>
        </>
      ) : (
        <h1>Mission {missionId}</h1>
      )}
    </div>
  );
}
