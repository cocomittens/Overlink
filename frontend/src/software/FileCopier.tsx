import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom } from "../store";

const FileCopier: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth * 0.8 : 0,
    y: typeof window !== "undefined" ? window.innerHeight * 0.85 : 0,
  });
  const [dragging, setDragging] = useState(true);
  const isDraggingRef = useRef(true);

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("file_copier");
    setCurrentSoftware(updatedSoftware);
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const elementAtPoint = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      const blocked = elementAtPoint?.closest(".message-icon, .software-icon");
      if (blocked) return;
      isDraggingRef.current = false;
      setDragging(false);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove, true);
    window.addEventListener("mouseup", handleUp, true);
    return () => {
      window.removeEventListener("mousemove", handleMove, true);
      window.removeEventListener("mouseup", handleUp, true);
    };
  }, []);

  const pickUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest(".cancel-icon")) return;
    isDraggingRef.current = true;
    setDragging(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel();
  };

  return (
    <div
      className="file-copier-widget"
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={pickUp}
    >
      <span>File Copier</span>
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <CancelIcon className="cancel-icon" onClick={handleCancelClick} />
      </span>
    </div>
  );
};

export default FileCopier;
