import React, { useEffect, useRef, useState } from "react";

const TRACKS = [
  "/audio/bg1.mp3",
  "/audio/bg2.mp3",
  "/audio/bg3.mp3",
  "/audio/bg4.mp3",
  "/audio/bg5.mp3",
  "/audio/bg6.mp3",
  "/audio/bg7.mp3",
];

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.volume = 0.35;
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    };
    audio.addEventListener("ended", handleEnded);

    const start = async () => {
      try {
        await audio.play();
      } catch (err) {
        setPaused(true);
      }
    };
    start();

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[trackIndex];
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setPaused(false))
      .catch(() => setPaused(true));
  }, [trackIndex]);

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

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  return (
    <div className="music-controls">
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
      <button
        className="music-toggle"
        onClick={nextTrack}
        aria-label="Next track"
      >
        <span className="material-symbols-outlined">skip_next</span>
      </button>
    </div>
  );
}
