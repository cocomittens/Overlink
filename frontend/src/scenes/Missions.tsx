import React, { useState } from "react";
import { Mission } from "../types/mission";
import "../styles/missions.scss";
import { MissionDescription } from "../components/MissionDescription";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { missionsAtom, currentMissionsAtom, ratingAtom, userAtom, refreshMissionsAtom } from "../store";
import { acceptMission } from "../api";

export default function Missions() {
  const [mission, setMission] = useState<number | null>(null);
  const user = useAtomValue(userAtom);
  const missionsLoadable = useAtomValue(loadable(missionsAtom));
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const [rating] = useAtom(ratingAtom);
  const refreshMissions = useSetAtom(refreshMissionsAtom);

  const missions = missionsLoadable.state === 'hasData' ? missionsLoadable.data : [];
  const currentMissions = currentMissionsLoadable.state === 'hasData' ? currentMissionsLoadable.data : [];

  const selectedMission = missions.find((m) => m.id === mission) || null;

  const handleAccept = async (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (mission && user) {
      try {
        await acceptMission(user.id, mission.id);
        // Refresh missions to update the lists
        refreshMissions();
      } catch (error) {
        console.error('Failed to accept mission:', error);
      }
    }
  };

  if (missionsLoadable.state === 'loading' || currentMissionsLoadable.state === 'loading') {
    return <div className="missions-container">Loading missions...</div>;
  }

  if (missionsLoadable.state === 'hasError' || currentMissionsLoadable.state === 'hasError') {
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
        <MissionDescription
          mission={selectedMission}
        />
      </div>
      <button
        type="submit"
        className={`${selectedMission && rating > selectedMission.minRating ? 'disabled' : ''}`}
        onClick={() => selectedMission && handleAccept(selectedMission.id)}
        disabled={!selectedMission || rating > selectedMission.minRating}
      >
        Accept
      </button>
    </div>
  );
}
