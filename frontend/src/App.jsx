import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAtom } from "jotai";
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
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
    setHydrated(true);
  }, [user, setUser]);

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
