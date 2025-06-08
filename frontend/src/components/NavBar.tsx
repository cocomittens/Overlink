import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/missions">Missions</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
