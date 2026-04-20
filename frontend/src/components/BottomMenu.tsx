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
import FileCopier from "../software/FileCopier";
import FileDeleter from "../software/FileDeleter";
import { HardDrive } from "./HardDrive";
import { Shop } from "./Shop";
import { UserProfile } from "./UserProfile";
import { loadable } from "jotai/utils";
import { abandonMission } from "../api";
import { useEffect, useRef } from "react";

const SoftwareList = ({ onSelect }: { onSelect?: () => void }) => {
  const [software] = useAtom(softwareAtom);
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

  return (
    <ul className="software-list">
      {software.map((item) => (
        <li
          key={item.id}
          onClick={() =>
            setCurrentSoftware((prev) => {
              const next = new Set(prev);
              const alreadyOpen = next.has(item.id);
              if (!alreadyOpen) {
                onSelect?.();
                next.add(item.id);
              }
              return alreadyOpen ? prev : next;
            })
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
  const [showProfile, setShowProfile] = useState(false);
  const [currentSoftware] = useAtom(currentSoftwareAtom);
  const [user] = useAtom(userAtom);
  const currentMissionsLoadable = useAtomValue(loadable(currentMissionsAtom));
  const refreshMissions = useSetAtom(refreshMissionsAtom);
  const abandonSoundRef = useRef<HTMLAudioElement | null>(null);
  const menuSelectSoundRef = useRef<HTMLAudioElement | null>(null);
  const mouseClickSoundRef = useRef<HTMLAudioElement | null>(null);
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
    mouseClickSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/mouse-click.mp3")
        : null;
    if (mouseClickSoundRef.current) {
      mouseClickSoundRef.current.volume = 0.75;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && abandonSoundRef.current) {
      abandonSoundRef.current.pause();
    }
    if (!soundEnabled && menuSelectSoundRef.current) {
      menuSelectSoundRef.current.pause();
    }
    if (!soundEnabled && mouseClickSoundRef.current) {
      mouseClickSoundRef.current.pause();
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

  const playMouseClick = () => {
    if (!soundEnabled || !mouseClickSoundRef.current) return;
    try {
      mouseClickSoundRef.current.pause();
      mouseClickSoundRef.current.currentTime = 0;
      mouseClickSoundRef.current.play();
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
        setShowProfile(false);
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
        setShowProfile(false);
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
        setShowProfile(false);
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
      refreshMissions();
      setSelectedMission(null);
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
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      <div className="bottom-menu">
        {showSoftware && <SoftwareList onSelect={playMouseClick} />}
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
          <li className="message-icon hard-drive" onClick={() => {
            playMenuSelect();
            setShowProfile((prev) => {
              const next = !prev;
              if (next) {
                setShowHardDrive(false);
                setShowShop(false);
                setSelectedMission(null);
              }
              return next;
            });
          }}>
            <span className="material-symbols-outlined">account_circle</span>
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
        {currentSoftware.has("file_copier") && <FileCopier />}
        {currentSoftware.has("file_deleter") && <FileDeleter />}
      </div>
    </>
  );
};

export default BottomMenu;
