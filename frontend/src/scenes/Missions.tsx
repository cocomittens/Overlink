import React, { useEffect, useState } from "react";
import { missions_data } from "../mockData";
import { Mission } from "../types/mission";
import "../styles/missions.scss";
import { MissionDescription } from "../components/MissionDescription";

export default function Missions() {
  const [mission, setMission] = useState<number | null>(null);

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
          {missions_data.map((mission: Mission) => (
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
    </div>
  );
}
