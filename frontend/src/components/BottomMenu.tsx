import "../styles/bottomMenu.scss";

import React, { useState } from "react";
import {
  currentMissionsAtom,
  currentSoftwareAtom,
  softwareAtom,
} from "../store";
import { useAtom, useAtomValue } from "jotai";

import { MissionDetails } from "./MissionDetails";
import TraceTracker from "./TraceTracker";
import { loadable } from "jotai/utils";

const SoftwareList = () => {
  const [software] = useAtom(softwareAtom);
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

  return (
    <ul className="software-list">
      {software.map((item) => (
        <li
          key={item.id}
          onClick={() =>
            setCurrentSoftware((prev) => new Set(prev).add(item.id))
          }
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

const BottomMenu: React.FC = () => {
  const [showSoftware, setShowSoftware] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [currentSoftware] = useAtom(currentSoftwareAtom);
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));

  const currentMissions =
    currentMissionsLoadable.state === "hasData"
      ? currentMissionsLoadable.data
      : [];

  return (
    <>
      <MissionDetails mission={selectedMission} />
      <div className="bottom-menu">
        {showSoftware && <SoftwareList />}
        <ul>
          <li
            className="software-icon"
            onClick={() => setShowSoftware(!showSoftware)}
          ></li>
        </ul>

        <ul className="messages">
          {currentMissions.map((mission) => {
            return <li key={mission.id} className="message-icon"></li>;
          })}
        </ul>
        {currentSoftware.has("trace_tracker") && <TraceTracker />}
      </div>
    </>
  );
};

export default BottomMenu;
