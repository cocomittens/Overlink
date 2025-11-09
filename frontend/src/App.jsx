import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
      <BottomMenu />
    </Router>
  );
}

export default App;
