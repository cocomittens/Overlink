import "../styles/missions.scss";

import React, { useEffect, useRef, useState } from "react";
import {
  currentMissionsAtom,
  missionsAtom,
  ratingAtom,
  refreshMissionsAtom,
  userAtom,
} from "../store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Mission } from "../types/mission";
import { MissionDescription } from "../components/MissionDescription";
import { acceptMission } from "../api";
import { loadable } from "jotai/utils";

export default function Missions() {
  const [mission, setMission] = useState<number | null>(null);
  const acceptSoundRef = useRef<HTMLAudioElement | null>(null);
  const user = useAtomValue(userAtom);
  const missionsLoadable = useAtomValue(loadable(missionsAtom));
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const [rating] = useAtom(ratingAtom);
  const refreshMissions = useSetAtom(refreshMissionsAtom);

  useEffect(() => {
    acceptSoundRef.current = typeof Audio !== "undefined" ? new Audio("/soundEffects/accept.mp3") : null;
    if (acceptSoundRef.current) {
      acceptSoundRef.current.volume = 0.6;
    }
  }, []);

  const missions =
    missionsLoadable.state === "hasData" ? missionsLoadable.data : [];

  const selectedMission = missions.find((m) => m.id === mission) || null;

  const handleAccept = async (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (mission && user) {
      try {
        await acceptMission(user.id, mission.id);
        if (acceptSoundRef.current) {
          acceptSoundRef.current.currentTime = 0;
          acceptSoundRef.current.play().catch(() => {});
        }
        // Refresh missions to update the lists
        refreshMissions();
      } catch (error) {
        console.error("Failed to accept mission:", error);
      }
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
      <h2>Available Missions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission: Mission) => (
            <tr key={mission.id} onClick={() => setMission(mission.id)}>
              <td>{new Date(mission.date).toLocaleDateString()}</td>
              <td>{mission.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <MissionDescription mission={selectedMission} />
      </div>
      <button
        type="submit"
        className={`${
          selectedMission && rating > selectedMission.minRating
            ? "disabled"
            : ""
        }`}
        onClick={() => selectedMission && handleAccept(selectedMission.id)}
        disabled={!selectedMission || rating > selectedMission.minRating}
      >
        Accept
      </button>
    </div>
  );
}
