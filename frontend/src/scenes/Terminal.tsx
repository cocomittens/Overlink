import React, { useState } from "react";
import { useAtom } from "jotai";
import { currentNodeAtom, dataAtom, directoryAtom } from "../store";
import "../styles/terminal.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { loadable } from "jotai/utils";
import { useAtomValue } from "jotai";

export default function Terminal() {
  const [currentNode, setCurrentNode] = useAtom(currentNodeAtom);
  const dataLoadable = useAtomValue(loadable(dataAtom));
  const data = dataLoadable.state === "hasData" ? dataLoadable.data : [];
  const currData = data.find((node: any) => node.id === currentNode);
  const [directory, setDirectory] = useAtom(directoryAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainDirectory = location.pathname === "/terminal";

  const handleBack = () => {
    if (isMainDirectory) return;
    const prev = sessionStorage.getItem("prevComputerPath");
    if (prev && prev !== "/login" && prev !== "/agentLogin") {
      navigate(prev);
    } else {
      navigate("/");
    }
  };

  const handleDisconnect = () => {
    setCurrentNode(null);
    setDirectory({ id: "", name: "", data: [] });
    sessionStorage.setItem("prevComputerPath", "/");
    sessionStorage.setItem("lastComputerPath", "/");
    navigate("/");
  };

  const handleClick = (folderId: string) => {
    const folder = currData?.directory.find((f) => f.id === folderId);
    if (folder) {
      setDirectory(folder);
      navigate(`/files`);
    }
    navigate(`/files`);
  };

  return (
    <div className="terminal">
      <div className="icon-row">
        <button
          type="button"
          className="icon-button violet"
          aria-label="Go back"
          onClick={handleBack}
          disabled={isMainDirectory}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          type="button"
          className="icon-button cyan"
          aria-label="Disconnect"
          onClick={handleDisconnect}
        >
          <span className="material-symbols-outlined">power_settings_new</span>
        </button>
      </div>
      <h2>{currData?.name}</h2>
      {currData?.directory.map((folder, index) => (
        <div key={index} className="folder">
          <a className="folder-name" onClick={() => handleClick(folder.id)}>
            {folder.name}
          </a>
        </div>
      ))}
    </div>
  );
}
