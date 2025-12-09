import React, { useEffect, useRef, useState } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom, useAtomValue } from "jotai";
import { TRACE_PROFILES } from "../types/mission";
import {
  currentNodeAtom,
  currentSoftwareAtom,
  soundEnabledAtom,
  traceStateAtom,
} from "../store";
import { useNavigate } from "react-router-dom";

const TraceTracker: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const [traceState, setTraceState] = useAtom(traceStateAtom);
  const [currentNode, setCurrentNode] = useAtom(currentNodeAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const navigate = useNavigate();
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth - 60 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 40 : 0,
  });
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const isDraggingRef = useRef(false);
  const justPickedRef = useRef(false);
  const offsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("trace_tracker");
    setCurrentSoftware(updatedSoftware);
    setTraceState({ active: false, progress: 0, profileId: null });
  }

  useEffect(() => {
    // initialize default profile if none
    if (!traceState.profileId) {
      setTraceState((prev) => ({
        ...prev,
        profileId: prev.profileId ?? "medium",
      }));
    }
  }, [traceState.profileId, setTraceState]);

  useEffect(() => {
    clickSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/mouse-click.mp3")
        : null;
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.6;
    }
    beepSoundRef.current =
      typeof Audio !== "undefined" ? new Audio("/soundEffects/trace-tracker.m4a") : null;
    if (beepSoundRef.current) {
      beepSoundRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.pause();
    }
    if (!soundEnabled && beepSoundRef.current) {
      beepSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const playClick = () => {
    if (soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => { });
    }
  };

  const playBeep = () => {
    if (soundEnabled && beepSoundRef.current) {
      beepSoundRef.current.currentTime = 0;
      beepSoundRef.current.play().catch(() => { });
    }
  };

  // Trace progression
  useEffect(() => {
    let intervalId: number | null = null;
    if (traceState.active) {
      const profile =
        TRACE_PROFILES[traceState.profileId ?? "medium"] ||
        TRACE_PROFILES.medium;
      const baseMs = profile.baseSeconds * 1000;
      const tickMs = 3000;
      intervalId = window.setInterval(() => {
        setTraceState((prev) => {
          if (!prev.active) return prev;
          const next = Math.min(
            100,
            prev.progress +
            ((tickMs / baseMs) * 100) * profile.accelFactor +
            (profile.actionPenalty * 0) // placeholder for future loud actions
          );
          if (next >= 100) {
            return { ...prev, progress: 100, active: false };
          }
          return { ...prev, progress: next };
        });
      }, tickMs);
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [traceState.active, traceState.profileId, setTraceState]);

  // Play beep when progress moves forward (side effect kept outside state setter)
  // Initialize with current progress to avoid false beep on page refresh when progress is loaded from localStorage
  const lastProgressRef = useRef(traceState.progress);

  useEffect(() => {
    // Only play beep if progress actually increased (not on initial mount with persisted value)
    if (traceState.active && traceState.progress > lastProgressRef.current) {
      playBeep();
    }
    lastProgressRef.current = traceState.progress;
  }, [traceState.progress, traceState.active, soundEnabled]);

  // When trace finishes, disconnect
  useEffect(() => {
    if (traceState.progress >= 100) {
      setCurrentSoftware((prev) => {
        const next = new Set(prev);
        next.delete("trace_tracker");
        return next;
      });
      setTraceState(() => ({ active: false, progress: 0, profileId: null }));
      sessionStorage.setItem("traced", "1");
      setCurrentNode(null);
      navigate("/");
    }
  }, [traceState.progress, setCurrentSoftware, setTraceState, setCurrentNode, navigate]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPosition({
        x: e.clientX - offsetRef.current.dx,
        y: e.clientY - offsetRef.current.dy,
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      if (justPickedRef.current) {
        justPickedRef.current = false;
        return;
      }
      isDraggingRef.current = false;
      setDragging(false);
      playClick();
      setPosition({
        x: e.clientX - offsetRef.current.dx,
        y: e.clientY - offsetRef.current.dy,
      });
    };

    window.addEventListener("mousemove", handleMove, true);
    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("mousemove", handleMove, true);
      window.removeEventListener("click", handleClick, true);
    };
  }, []);

  const pickUp = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest(".cancel-icon")) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    offsetRef.current = {
      dx: e.clientX - centerX,
      dy: e.clientY - centerY,
    };
    playClick();
    isDraggingRef.current = true;
    setDragging(true);
    setHasDragged(true);
    justPickedRef.current = true;
    setPosition({
      x: e.clientX - offsetRef.current.dx,
      y: e.clientY - offsetRef.current.dy,
    });
  };

  const style: React.CSSProperties = hasDragged
    ? {
      top: position.y,
      left: position.x,
      transform: dragging
        ? "translate(-50%, -50%) scale(1.03)"
        : "translate(-50%, -50%)",
    }
    : {
      right: 8,
      bottom: 4,
    };

  return (
    <div
      className={`trace-tracker${dragging ? " dragging" : ""}`}
      style={style}
      onMouseDown={pickUp}
    >
      <span>{Math.round(traceState.progress)}%</span>
      <CancelIcon onClick={handleCancel} />
    </div>
  );
};

export default TraceTracker;
