import "../styles/bottomMenu.scss";

import React, { useState } from "react";
import {
  currentMissionsAtom,
  currentSoftwareAtom,
  refreshMissionsAtom,
  userAtom,
  softwareAtom,
} from "../store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { MissionDetails } from "./MissionDetails";
import TraceTracker from "./TraceTracker";
import { HardDrive } from "./HardDrive";
import { Shop } from "./Shop";
import { loadable } from "jotai/utils";
import { abandonMission } from "../api";
import { useEffect, useRef } from "react";

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
  const [selectedMission, setSelectedMission] = useState<number | null>(null);
  const [showHardDrive, setShowHardDrive] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentSoftware] = useAtom(currentSoftwareAtom);
  const [user] = useAtom(userAtom);
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const refreshMissions = useSetAtom(refreshMissionsAtom);
  const abandonSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    abandonSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (abandonSoundRef.current) {
      abandonSoundRef.current.volume = 0.6;
    }
  }, []);

  const currentMissions =
    currentMissionsLoadable.state === "hasData"
      ? currentMissionsLoadable.data
      : [];

  const setMission = (id: number) => {
    if (selectedMission === id) {
      setSelectedMission(null);
    } else {
      setSelectedMission(id);
    }
  };

  const handleAbandon = async (missionId: number) => {
    if (!user) return;
    try {
      await abandonMission(user.id, missionId);
      if (abandonSoundRef.current) {
        abandonSoundRef.current.currentTime = 0;
        abandonSoundRef.current.play().catch(() => {});
      }
      setSelectedMission(null);
      refreshMissions();
    } catch (err) {
      console.error("Failed to abandon mission", err);
    }
  };

  return (
    <>
      <MissionDetails
        missionId={selectedMission}
        onClose={() => setSelectedMission(null)}
        onAbandon={handleAbandon}
      />
      {showHardDrive && <HardDrive onClose={() => setShowHardDrive(false)} />}
      {showShop && <Shop onClose={() => setShowShop(false)} />}
      <div className="bottom-menu">
        {showSoftware && <SoftwareList />}
        <ul className="left-icons">
          <li
            className="software-icon"
            onClick={() => setShowSoftware(!showSoftware)}
          >
            <span className="material-symbols-outlined">widgets</span>
          </li>
          <li
            className="message-icon hard-drive"
            onClick={() => setShowHardDrive((prev) => !prev)}
          >
            <span className="material-symbols-outlined">hard_drive</span>
          </li>
          <li
            className="message-icon hard-drive"
            onClick={() => setShowShop((prev) => !prev)}
          >
            <span className="material-symbols-outlined">shop</span>
          </li>
        </ul>

        <ul className="messages">
          {currentMissions.map((mission) => {
            return (
              <li
                key={mission.id}
                onClick={() => setMission(mission.id)}
                className="message-icon"
              >
                <span className="material-symbols-outlined">mail</span>
              </li>
            );
          })}
        </ul>
        {currentSoftware.has("trace_tracker") && <TraceTracker />}
      </div>
    </>
  );
};

export default BottomMenu;
