import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { soundEnabledAtom } from "../store";

const TRACKS = [
  "/audio/bg1.mp3",
  "/audio/bg2.mp3",
  "/audio/bg3.mp3",
  "/audio/bg4.mp3",
  "/audio/bg5.mp3",
  "/audio/bg6.mp3",
  "/audio/bg7.mp3",
  "/audio/bg8.mp3",
  "/audio/bg9.mp3",
  "/audio/bg10.mp3",
  "/audio/bg11.mp3",
  "/audio/bg12.mp3",
  "/audio/bg13.mp3",
  "/audio/bg14.mp3",
  "/audio/bg15.mp3",
  "/audio/bg16.mp3",
  "/audio/bg17.mp3",
];

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeOnEnableRef = useRef(false);
  const initialSoundEnabled = useRef<boolean | null>(null);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useAtom(soundEnabledAtom);
  const [trackIndex, setTrackIndex] = useState(() =>
    Math.floor(Math.random() * TRACKS.length)
  );

  useEffect(() => {
    const audio = new Audio(TRACKS[trackIndex]);
    audio.volume = 0.35;
    if (initialSoundEnabled.current === null) {
      initialSoundEnabled.current = soundEnabled;
    }
    audio.muted = !initialSoundEnabled.current;
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    };
    audio.addEventListener("ended", handleEnded);

    if (initialSoundEnabled.current) {
      const start = async () => {
        try {
          await audio.play();
        } catch (err) {
          setPaused(true);
        }
      };
      start();
    } else {
      setPaused(true);
    }

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
    if (!soundEnabled) {
      audio.pause();
      setPaused(true);
      return;
    }
    audio
      .play()
      .then(() => setPaused(false))
      .catch(() => setPaused(true));
  }, [trackIndex, soundEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !soundEnabled;
    if (!soundEnabled) {
      resumeOnEnableRef.current = !audio.paused;
      if (!audio.paused) {
        audio.pause();
        setPaused(true);
      }
    } else if (resumeOnEnableRef.current) {
      audio
        .play()
        .then(() => setPaused(false))
        .catch(() => setPaused(true));
      resumeOnEnableRef.current = false;
    }
  }, [soundEnabled]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !soundEnabled) return;
    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  const toggleSound = () => {
    const audio = audioRef.current;
    if (audio && soundEnabled && !audio.paused) {
      resumeOnEnableRef.current = true;
    }
    setSoundEnabled((prev) => !prev);
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  return (
    <div className="music-controls">
      <button
        className={`music-toggle`}
        onClick={toggleSound}
        aria-label={soundEnabled ? "Turn off sound" : "Turn on sound"}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? (
          <span className="material-icons">music_note</span>
        ) : (
          <span className="material-icons">music_off</span>
        )}
      </button>
      <button
        className={`music-toggle ${paused ? "paused" : "playing"}`}
        onClick={togglePlayPause}
        aria-label={paused ? "Play music" : "Pause music"}
        aria-pressed={!paused}
        disabled={!soundEnabled}
      >
        {paused ? (
          <span className="material-icons">play_arrow</span>
        ) : (
          <span className="material-icons">pause</span>
        )}
      </button>
      <button
        className="music-toggle"
        onClick={nextTrack}
        aria-label="Next track"
      >
        <span className="material-icons">skip_next</span>
      </button>
    </div>
  );
}
