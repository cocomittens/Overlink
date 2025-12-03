import "../styles/missions.scss";

import React, { useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, soundEnabledAtom } from "../store";
import CancelIcon from "./CancelIcon";
import { useNavigate } from "react-router-dom";

export function UserProfile({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useAtom(userAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const navigate = useNavigate();
  const logoutSoundRef = useRef<HTMLAudioElement | null>(null);

  const handleClose = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    onClose();
  };

  const handleLogout = () => {
    if (!logoutSoundRef.current && typeof Audio !== "undefined") {
      logoutSoundRef.current = new Audio("/soundEffects/cancel.wav");
      logoutSoundRef.current.volume = 0.6;
    }
    if (soundEnabled && logoutSoundRef.current) {
      try {
        logoutSoundRef.current.currentTime = 0;
        logoutSoundRef.current.play();
      } catch {
        /* ignore playback errors */
      }
    }
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    onClose();
  };

  return (
    <div className="details-container user-profile">
      <div className="mission-info">
        <div className="header" style={{ padding: "1%" }}>
          <span>User details</span>
          <CancelIcon onClick={handleClose} aria-label="Close user details" />
        </div>
        <div className="mission-info-body">
          <div className="small-field">Username: {user?.username ?? "—"}</div>
          <div className="small-field">
            Level: {user ? Math.floor((user.xp ?? 0) / 100) : 0} / XP:{" "}
            {user?.xp ?? 0}
          </div>
        </div>
        <div className="action-buttons">
          <div className="mission-action" onClick={handleLogout}>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
