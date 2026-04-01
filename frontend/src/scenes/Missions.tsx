import "../styles/missions.scss";

import React, { useEffect, useRef, useState } from "react";
import {
  currentMissionsAtom,
  missionsAtom,
  moneyAtom,
  refreshMissionsAtom,
  userAtom,
  soundEnabledAtom,
  deletedServerFilesAtom,
  hardDriveAtom,
} from "../store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Mission } from "../types/mission";
import { MissionDescription } from "../components/MissionDescription";
import { acceptMission, resetMissions } from "../api";
import { loadable } from "jotai/utils";
import { calculateLevelProgress } from "../util/level";

export default function Missions() {
  const [mission, setMission] = useState<number | null>(null);
  const acceptSoundRef = useRef<HTMLAudioElement | null>(null);
  const cancelSoundRef = useRef<HTMLAudioElement | null>(null);
  const user = useAtomValue(userAtom);
  const missionsLoadable = useAtomValue(loadable(missionsAtom));
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const refreshMissions = useSetAtom(refreshMissionsAtom);
  const [money, setMoney] = useAtom(moneyAtom);
  const setDeletedServerFiles = useSetAtom(deletedServerFilesAtom);
  const setHardDrive = useSetAtom(hardDriveAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const userLevel = calculateLevelProgress(user?.xp ?? 0).level;

  useEffect(() => {
    acceptSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/accept.mp3")
        : null;
    if (acceptSoundRef.current) {
      acceptSoundRef.current.volume = 0.6;
    }
    cancelSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (cancelSoundRef.current) {
      cancelSoundRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && acceptSoundRef.current) {
      acceptSoundRef.current.pause();
    }
    if (!soundEnabled && cancelSoundRef.current) {
      cancelSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const missions =
    missionsLoadable.state === "hasData" ? missionsLoadable.data : [];

  const selectedMission = missions.find((m) => m.id === mission) || null;

  const handleAccept = async (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (mission && user) {
      try {
        await acceptMission(user.id, mission.id);
        if (soundEnabled && acceptSoundRef.current) {
          acceptSoundRef.current.currentTime = 0;
          acceptSoundRef.current.play().catch(() => {});
        }
        setMission(null);
        refreshMissions();
      } catch (error) {
        console.error("Failed to accept mission:", error);
      }
    }
  };

  const handleReset = async () => {
    if (!user) return;
    try {
      await resetMissions(user.id);
      if (soundEnabled && cancelSoundRef.current) {
        cancelSoundRef.current.currentTime = 0;
        cancelSoundRef.current.play().catch(() => {});
      }
      setMoney(1000);
      setDeletedServerFiles([]);
      setHardDrive({ capacity: 10, files: [] });
      setMission(null);
      refreshMissions();
    } catch (err) {
    }
  };

  if (
    missionsLoadable.state === "loading" ||
    currentMissionsLoadable.state === "loading"
  ) {
    return <div className="missions-container">Loading missions...</div>;
  }

  if (
    missionsLoadable.state === "hasError" ||
    currentMissionsLoadable.state === "hasError"
  ) {
    return <div className="missions-container">Error loading missions</div>;
  }

  return (
    <div className="missions-container">
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>Available Missions</h2>
        <span
          className="material-icons"
          style={{ cursor: "pointer", fontSize: "1.2em", opacity: 0.7, position: "relative", top: "2px" }}
          onClick={handleReset}
          title="Reset all missions and money"
        >
          restart_alt
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {missions.length === 0 ? (
            <tr>
              <td colSpan={2}>No new missions are currently available</td>
            </tr>
          ) : (
            missions.map((mission: Mission) => (
              <tr key={mission.id} onClick={() => setMission(mission.id)}>
                <td>{new Date(mission.date).toLocaleDateString()}</td>
                <td>{mission.title}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div>
        <MissionDescription mission={selectedMission} />
      </div>
      <button
        type="button"
        className={`${
          !selectedMission || userLevel < selectedMission.minRating
            ? "disabled"
            : ""
        }`}
        onClick={() => {
          if (selectedMission) {
            handleAccept(selectedMission.id);
          }
        }}
        disabled={!selectedMission || userLevel < selectedMission.minRating}
      >
        Accept
      </button>
    </div>
  );
}
