import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import {
  currentNodeAtom,
  dataAtom,
  directoryAtom,
  soundEnabledAtom,
} from "../store";
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
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const cancelSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    cancelSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (cancelSoundRef.current) {
      cancelSoundRef.current.volume = 0.6;
    }
    clickSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/mouse-click.mp3")
        : null;
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.75;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && cancelSoundRef.current) {
      cancelSoundRef.current.pause();
    }
    if (!soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const handleBack = () => {
    if (isMainDirectory) return;
    if (soundEnabled && clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play();
      } catch {
        /* ignore playback errors */
      }
    }
    const prev = sessionStorage.getItem("prevComputerPath");
    if (prev && prev !== "/login" && prev !== "/agentLogin") {
      navigate(prev);
    } else {
      navigate("/");
    }
  };

  const handleDisconnect = () => {
    if (soundEnabled && cancelSoundRef.current) {
      try {
        cancelSoundRef.current.currentTime = 0;
        cancelSoundRef.current.play();
      } catch {
        /* ignore playback errors */
      }
    }
    setCurrentNode(null);
    setDirectory({ id: "", name: "", data: [] });
    sessionStorage.setItem("prevComputerPath", "/");
    sessionStorage.setItem("lastComputerPath", "/");
    navigate("/");
  };

  const handleClick = (folderId: string) => {
    const folder = currData?.directory.find((f: any) => f.id === folderId);
    if (folder) {
      const nextDirectory = {
        id: folder.id ?? "",
        name: folder.name ?? "",
        data: folder.data ?? [],
        folders: folder.folders ?? folder.directory ?? [],
      };
      setDirectory(nextDirectory);
      if (soundEnabled && clickSoundRef.current) {
        try {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play();
        } catch {
          /* ignore playback errors */
        }
      }
      navigate(`/files`);
      return;
    }
    if (soundEnabled && clickSoundRef.current) {
      try {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play();
      } catch {
        /* ignore playback errors */
      }
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
