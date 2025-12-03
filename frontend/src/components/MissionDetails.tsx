import "../styles/missions.scss";

import { Mission } from "../types/mission";
import React from "react";
import { currentMissionsAtom } from "../store";
import { loadable } from "jotai/utils";
import { useAtomValue } from "jotai";
import CancelIcon from "../components/CancelIcon";

export function MissionDetails({
  missionId,
  onClose,
  onAbandon,
}: {
  missionId: number | null;
  onClose: () => void;
  onAbandon: (missionId: number) => void;
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

  const handleAbandon = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (missionId !== null) {
      onAbandon(missionId);
    }
  };

  return (
    <div className="details-container" style={{ zIndex: 1 }}>
      {mission ? (
        <>
          <div className="mission-info">
            <div className="header">
              <span>Mission</span>
              <CancelIcon
                onClick={handleClose}
                aria-label="Close mission details"
              />
            </div>
            <div className="small-field">{mission.title}</div>
            <div className="small-field">
              <strong>Employer:</strong> {mission.employer}
            </div>
            <div className="small-field">
              <strong>Payment:</strong> {mission.payment} credits
            </div>
            <div className="large-field" style={{ padding: "1% 2%" }}>
              <strong>Description:</strong>
              <div>{mission.description}</div>
            </div>
          </div>
          <div className="action-buttons">
            <div className="mission-action">
              <span>Complete</span>
            </div>
            <div className="mission-action">
              <span
                role="button"
                tabIndex={0}
                onClick={handleAbandon}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAbandon(e);
                  }
                }}
              >
                Abort
              </span>
            </div>
          </div>
        </>
      ) : (
        <h1>Mission {missionId}</h1>
      )}
    </div>
  );
}
