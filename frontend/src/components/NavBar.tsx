import "../styles/navbar.scss";

import { moneyAtom, soundEnabledAtom, userAtom } from "../store";

import { BackgroundMusic } from "./BackgroundMusic";
import { Link } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { calculateLevelProgress } from "../util/level";

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
  const [user] = useAtom(userAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const mapOpenSoundRef = useRef<HTMLAudioElement | null>(null);
  const currentXp = user?.xp ?? 0;
  const { level, progress } = calculateLevelProgress(currentXp);
  const filledBlocks = Math.round(progress * 10);

  useEffect(() => {
    mapOpenSoundRef.current =
      typeof Audio !== "undefined" ? new Audio("/soundEffects/map-open.mp3") : null;
    if (mapOpenSoundRef.current) {
      mapOpenSoundRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && mapOpenSoundRef.current) {
      mapOpenSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const handleMapOpen = () => {
    if (soundEnabled && mapOpenSoundRef.current) {
      mapOpenSoundRef.current.currentTime = 0;
      mapOpenSoundRef.current.play().catch(() => {});
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="left-controls">
          <div className="message-icon">
            <Link to="/map" onClick={handleMapOpen}>
              <span className="material-symbols-outlined message-icon">
                map
              </span>
            </Link>
          </div>
          <div className="message-icon">
            <Link to="/missions">
              <span className="material-symbols-outlined message-icon">
                task
              </span>
            </Link>
          </div>
        </li>

        <li className="right-controls">
          <BackgroundMusic />
          <span className="money">${money}</span>
          <div
            className="level-display"
            aria-label={`Level ${level} progress ${Math.round(
              progress * 100
            )} percent`}
          >
            <span className="level-label">LV {level}</span>
            <div className="xp-bar">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`xp-block ${idx < filledBlocks ? "filled" : ""}`}
                />
              ))}
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
