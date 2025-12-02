import "./App.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import AgentLogin from "./scenes/AgentLogin.tsx";
import BottomMenu from "./components/BottomMenu.tsx";
import FileList from "./scenes/FileList.tsx";
import Home from "./scenes/Home.tsx";
import Login from "./scenes/Login.tsx";
import Map from "./scenes/Map.tsx";
import Missions from "./scenes/Missions.tsx";
import NavBar from "./components/NavBar";
import Terminal from "./scenes/Terminal.tsx";
import { useAtom } from "jotai";
import { userAtom } from "./store";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useAtom(userAtom);
  const [hydrated, setHydrated] = useState(false);
  const hideBottomMenu = location.pathname === "/agentLogin";
  const withUser = (element) => {
    if (!hydrated && !user) return null;
    return user ? element : <Navigate to="/agentLogin" replace />;
  };

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const hydratedUser = {
            ...parsed,
            xp:
              parsed.xp ??
              (parsed.username && parsed.username.toLowerCase() === "demo"
                ? 420
                : 0),
          };
          setUser(hydratedUser);
          localStorage.setItem("user", JSON.stringify(hydratedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
    setHydrated(true);
  }, [user, setUser]);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/agentLogin") {
      return;
    }
    const lastPath = sessionStorage.getItem("lastComputerPath");
    if (lastPath && lastPath !== location.pathname) {
      sessionStorage.setItem("prevComputerPath", lastPath);
    }
    sessionStorage.setItem("lastComputerPath", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={withUser(<Home />)} />
        <Route path="/login" element={withUser(<Login />)} />
        <Route path="/map" element={withUser(<Map />)} />
        <Route path="/missions" element={withUser(<Missions />)} />
        <Route path="/terminal" element={withUser(<Terminal />)} />
        <Route path="/files" element={withUser(<FileList />)} />
        <Route path="/agentLogin" element={<AgentLogin />} />
      </Routes>
      {!hideBottomMenu && <BottomMenu />}
    </>
  );
}

export default App;
