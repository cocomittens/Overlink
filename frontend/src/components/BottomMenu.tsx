import "../styles/bottomMenu.scss";

import React, { useState } from "react";
import {
  currentMissionsAtom,
  currentSoftwareAtom,
  refreshMissionsAtom,
  userAtom,
  softwareAtom,
  soundEnabledAtom,
} from "../store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { MissionDetails } from "./MissionDetails";
import TraceTracker from "../software/TraceTracker";
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
  const menuSelectSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useAtomValue(soundEnabledAtom);

  useEffect(() => {
    abandonSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (abandonSoundRef.current) {
      abandonSoundRef.current.volume = 0.6;
    }
    menuSelectSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/menu_select.mp3")
        : null;
    if (menuSelectSoundRef.current) {
      menuSelectSoundRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && abandonSoundRef.current) {
      abandonSoundRef.current.pause();
    }
    if (!soundEnabled && menuSelectSoundRef.current) {
      menuSelectSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const currentMissions =
    currentMissionsLoadable.state === "hasData"
      ? currentMissionsLoadable.data
      : [];

  const playMenuSelect = () => {
    if (!soundEnabled || !menuSelectSoundRef.current) return;
    try {
      menuSelectSoundRef.current.currentTime = 0;
      menuSelectSoundRef.current.play();
    } catch {
      /* ignore playback errors */
    }
  };

  const openMission = (id: number) => {
    playMenuSelect();
    setSelectedMission((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        setShowHardDrive(false);
        setShowShop(false);
      }
      return next;
    });
  };

  const toggleHardDrive = () => {
    playMenuSelect();
    setShowHardDrive((prev) => {
      const next = !prev;
      if (next) {
        setShowShop(false);
        setSelectedMission(null);
      }
      return next;
    });
  };

  const toggleShop = () => {
    playMenuSelect();
    setShowShop((prev) => {
      const next = !prev;
      if (next) {
        setShowHardDrive(false);
        setSelectedMission(null);
      }
      return next;
    });
  };

  const toggleSoftware = () => {
    playMenuSelect();
    setShowSoftware((prev) => !prev);
  };

  const handleAbandon = async (missionId: number) => {
    if (!user) return;
    try {
      await abandonMission(user.id, missionId);
      if (soundEnabled && abandonSoundRef.current) {
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
          <li className="software-icon" onClick={toggleSoftware}>
            <span className="material-symbols-outlined">widgets</span>
          </li>
          <li className="message-icon hard-drive" onClick={toggleHardDrive}>
            <span className="material-symbols-outlined">hard_drive</span>
          </li>
          <li className="message-icon hard-drive" onClick={toggleShop}>
            <span className="material-symbols-outlined">shop</span>
          </li>
        </ul>

        <ul className="messages">
          {currentMissions.map((mission) => {
            return (
              <li
                key={mission.id}
                onClick={() => openMission(mission.id)}
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
