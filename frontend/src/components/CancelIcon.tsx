import React, { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { soundEnabledAtom } from "../store";

const CancelIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}> = ({
  size = 24,
  color = "currentColor",
  className = "",
  onClick = () => {},
}) => {
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const closeSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    closeSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/mouse-click.mp3")
        : null;
    if (closeSoundRef.current) {
      closeSoundRef.current.volume = 0.6;
    }
  }, []);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (soundEnabled && closeSoundRef.current) {
      try {
        closeSoundRef.current.currentTime = 0;
        closeSoundRef.current.play();
      } catch {
        /* ignore playback errors */
      }
    }
    onClick?.(e);
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={handleClick}
    >
      <circle cx="12" cy="12" r="12" fill="none" />
      <line
        x1="7"
        y1="7"
        x2="17"
        y2="17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="7"
        x2="7"
        y2="17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CancelIcon;
