import "../styles/navbar.scss";

import {
  moneyAtom,
  soundEnabledAtom,
  userAtom,
  currentNodeAtom,
} from "../store";

import { BackgroundMusic } from "./BackgroundMusic";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { calculateLevelProgress } from "../util/level";

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
  const [user] = useAtom(userAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const currentNode = useAtomValue(currentNodeAtom);
  const menuOpenSoundRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const currentXp = user?.xp ?? 0;
  const { level, progress } = calculateLevelProgress(currentXp);
  const filledBlocks = Math.round(progress * 10);

  useEffect(() => {
    menuOpenSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/menu-open.wav")
        : null;
    if (menuOpenSoundRef.current) {
      menuOpenSoundRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && menuOpenSoundRef.current) {
      menuOpenSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const playMenuOpen = () => {
    if (soundEnabled && menuOpenSoundRef.current) {
      menuOpenSoundRef.current.currentTime = 0;
      menuOpenSoundRef.current.play().catch(() => {});
    }
  };

  const handleHome = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      playMenuOpen();
      if (currentNode) {
        const lastPath = sessionStorage.getItem("lastComputerPath");
        const target =
          lastPath && (lastPath.startsWith("/terminal") || lastPath.startsWith("/files"))
            ? lastPath
            : "/terminal";
        navigate(target);
      } else {
        navigate("/");
      }
    },
    [currentNode, navigate, playMenuOpen]
  );

  return (
    <nav className="navbar">
      <ul>
        <li className="left-controls">
          <div className="message-icon">
            <a href="/" onClick={handleHome}>
              <span className="material-symbols-outlined message-icon">
                home
              </span>
            </a>
          </div>
          <div className="message-icon">
            <Link to="/map" onClick={playMenuOpen}>
              <span className="material-symbols-outlined message-icon">
                map
              </span>
            </Link>
          </div>
          <div className="message-icon">
            <Link to="/missions" onClick={playMenuOpen}>
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
