import "../styles/navbar.scss";

import { moneyAtom, userAtom } from "../store";

import { BackgroundMusic } from "./BackgroundMusic";
import { Link } from "react-router-dom";
import React from "react";
import { useAtom } from "jotai";

export const LEVEL_XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 200,
  4: 400,
  5: 800,
  6: 1600,
  7: 3200,
  8: 6400,
};

const calculateLevelProgress = (totalXp: number) => {
  const sorted = Object.entries(LEVEL_XP_THRESHOLDS)
    .map(([lvl, xp]) => ({ level: Number(lvl), xp }))
    .sort((a, b) => a.level - b.level);

  let level = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (totalXp >= sorted[i].xp) {
      level = sorted[i].level;
    } else {
      break;
    }
  }

  const currentThreshold = sorted.find((item) => item.level === level)?.xp ?? 0;
  const nextThreshold =
    sorted.find((item) => item.level === level + 1)?.xp ?? null;

  const progress =
    nextThreshold === null
      ? 1
      : Math.max(
          0,
          Math.min(
            1,
            (totalXp - currentThreshold) / (nextThreshold - currentThreshold)
          )
        );

  return { level, progress };
};

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
  const [user] = useAtom(userAtom);
  const currentXp = user?.xp ?? 0;
  const { level, progress } = calculateLevelProgress(currentXp);
  const filledBlocks = Math.round(progress * 10);

  return (
    <nav className="navbar">
      <ul>
        <li className="left-controls">
          <div className="message-icon">
            <Link to="/map">
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
