import React, { useEffect, useRef, useState } from "react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const audio = new Audio("../../public/audio/bg1.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const start = async () => {
      try {
        await audio.play();
      } catch (err) {
        setPaused(true);
      }
    };
    start();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  return (
    <button
      className="music-toggle"
      onClick={toggle}
      aria-label={paused ? "Play music" : "Pause music"}
      aria-pressed={!paused}
    >
      {paused ? (
        <span className="material-symbols-outlined">play_arrow</span>
      ) : (
        <span className="material-symbols-outlined">pause</span>
      )}
    </button>
  );
}
