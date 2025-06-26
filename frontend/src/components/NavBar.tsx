import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";
import { useAtom } from "jotai";
import { moneyAtom } from "../store";

const NavBar: React.FC = () => {
  const [money] = useAtom(moneyAtom);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/missions">Missions</Link>
        </li>
        <li className="money">
          <span>${money}</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
