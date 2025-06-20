import React, { useEffect, useState } from "react";
import { missions_data } from "../mockData";
import { Mission } from "../types/mission";
import "../styles/missions.scss";
import { MissionDescription } from "../components/MissionDescription";
import { useAtom } from "jotai";
import { missionsAtom, currentMissionsAtom, ratingAtom } from "../store";

export default function Missions() {
  const [mission, setMission] = useState<number | null>(null);
  const [missions, setMissions] = useAtom(missionsAtom);
  const [currentMissions, setCurrentMissions] = useAtom(currentMissionsAtom);
  const [rating] = useAtom(ratingAtom);

  const selectedMission = missions.find((m) => m.id === mission) || null;

  const handleAccept = (id: number) => {
    const mission = missions.find((m) => m.id === id);
    if (mission) {
      setCurrentMissions((prev) => [...prev, mission]);
      setMissions((prev) => prev.filter((m) => m.id !== id));
    }
  };

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
          mission={mission ? missions_data[mission - 1] : null}
        />
      </div>
      <button
        type="submit"
        className={`${selectedMission && rating > selectedMission.minRating ? 'disabled' : ''}`}
        onClick={() => selectedMission && handleAccept(selectedMission.id)}
        disabled={!selectedMission || rating > selectedMission.minRating}
      >
        Proceed
      </button>
    </div>
  );
}
