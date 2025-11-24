import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import AgentLogin from "./scenes/AgentLogin.tsx";
import BottomMenu from "./components/BottomMenu.tsx";
import FileList from "./scenes/FileList.tsx";
import Home from "./scenes/Home.tsx";
import Login from "./scenes/Login.tsx";
import Map from "./scenes/Map.tsx";
import Missions from "./scenes/Missions.tsx";
import NavBar from "./components/NavBar";
import Terminal from "./scenes/Terminal.tsx";
import useAutoLogin from "./util/useAutoLogin.ts";

function App() {
  useAutoLogin();
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideBottomMenu = location.pathname === "/agentLogin";

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/files" element={<FileList />} />
        <Route path="/agentLogin" element={<AgentLogin />} />
      </Routes>
      {!hideBottomMenu && <BottomMenu />}
    </>
  );
}

export default App;
