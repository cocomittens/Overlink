import React, { useEffect, useRef, useState } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom, useAtomValue } from "jotai";
import {
  currentSoftwareAtom,
  soundEnabledAtom,
  traceAtom,
  traceTimeAtom,
} from "../store";

const TraceTracker: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const [trace, setTrace] = useAtom(traceAtom);
  const [traceTime, setTraceTime] = useAtom(traceTimeAtom);
  const soundEnabled = useAtomValue(soundEnabledAtom);
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

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("trace_tracker");
    setCurrentSoftware(updatedSoftware);
    setTrace(0);
  }

  function handleTrace(time_remaining: number) {
    const startTime = Date.now();
    const endTime = startTime + time_remaining;

    const updateTrace = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min((elapsed / time_remaining) * 100, 100);

      setTrace(progress);

      if (progress < 100) {
        requestAnimationFrame(updateTrace);
      }
    };

    updateTrace();
  }

  useEffect(() => {
    if (traceTime > 0) {
      handleTrace(traceTime);
    }
  }, [traceTime]);

  useEffect(() => {
    clickSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/mouse-click.mp3")
        : null;
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.pause();
    }
  }, [soundEnabled]);

  const playClick = () => {
    if (soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

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
      <span>{Math.round(trace)}%</span>
      <CancelIcon onClick={handleCancel} />
    </div>
  );
};

export default TraceTracker;
