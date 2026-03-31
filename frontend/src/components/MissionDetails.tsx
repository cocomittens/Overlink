import "../styles/missions.scss";

import { Mission } from "../types/mission";
import React, { useEffect, useRef, useState } from "react";
import {
  currentMissionsAtom,
  hardDriveAtom,
  moneyAtom,
  userAtom,
  refreshMissionsAtom,
  soundEnabledAtom,
} from "../store";
import { loadable } from "jotai/utils";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { completeMission } from "../api";
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
  const [hardDrive] = useAtom(hardDriveAtom);
  const [money, setMoney] = useAtom(moneyAtom);
  const user = useAtomValue(userAtom);
  const refreshMissions = useSetAtom(refreshMissionsAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const [error, setError] = useState<string | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/accept.mp3")
        : null;
    if (successSoundRef.current) successSoundRef.current.volume = 0.6;
    errorSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0.6;
  }, []);

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
    setError(null);
    onClose();
  };

  const handleAbandon = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setError(null);
    if (missionId !== null) {
      onAbandon(missionId);
    }
  };


  const handleComplete = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!mission || !user) return;

    const targets = mission.targets ?? [];
    for (const target of targets) {
      if (target.objective === "copy" && target.filePattern) {
        if (!hardDrive.files.includes(target.filePattern)) {
          if (soundEnabled && errorSoundRef.current) {
            errorSoundRef.current.currentTime = 0;
            errorSoundRef.current.play().catch(() => {});
          }
          return;
        }
      }
    }

    try {
      await completeMission(user.id, mission.id);
      if (soundEnabled && successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current.play().catch(() => {});
      }
      setMoney(money + mission.payment);
      setError(null);
      onClose();
      refreshMissions();
    } catch (err) {

    }
  };

  return (
    <div className="details-container" style={{ zIndex: 1 }}>
      {mission ? (
        <>
          <div className="mission-info">
            <div className="header" style={{ padding: "1% 0" }}>
              <span>Mission</span>
              <CancelIcon
                onClick={handleClose}
                aria-label="Close mission details"
              />
            </div>
            <div className="mission-info-body">
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
          </div>
          <div className="action-buttons">
            <div className="mission-action">
              <span
                role="button"
                tabIndex={0}
                onClick={handleComplete}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleComplete(e);
                  }
                }}
              >
                Complete
              </span>
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
