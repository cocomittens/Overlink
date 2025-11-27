import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";
import { useAtom } from "jotai";
import { moneyAtom } from "../store";
import { BackgroundMusic } from "./BackgroundMusic";

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
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
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
