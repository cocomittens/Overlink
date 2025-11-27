import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";
import { useAtom } from "jotai";
import { moneyAtom } from "../store";
import { BackgroundMusic } from "./BackgroundMusic";

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
  const level = 3;
  const currentXp = 300;
  const xpToNextLevel = 1000;
  const progress = Math.max(0, Math.min(1, currentXp / xpToNextLevel));
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
            aria-label={`Level ${level} progress ${Math.round(progress * 100)} percent`}
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
