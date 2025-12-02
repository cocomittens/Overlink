import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom, hardDriveAtom, selectedFileAtom } from "../store";

const FileCopier: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const [hardDrive, setHardDrive] = useAtom(hardDriveAtom);
  const [selectedFile] = useAtom(selectedFileAtom);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth * 0.8 : 0,
    y: typeof window !== "undefined" ? window.innerHeight * 0.85 : 0,
  });
  const [dragging, setDragging] = useState(true);
  const isDraggingRef = useRef(true);
  const justPickedRef = useRef(false);
  const offsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("file_copier");
    setCurrentSoftware(updatedSoftware);
  }

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
      const widget = (e.target as HTMLElement)?.closest(
        ".file-copier-widget"
      ) as HTMLElement | null;
      let elementAtPoint = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      let restore: (() => void) | null = null;
      if (widget) {
        const prev = widget.style.pointerEvents;
        widget.style.pointerEvents = "none";
        restore = () => {
          widget.style.pointerEvents = prev;
        };
        elementAtPoint = document.elementFromPoint(
          e.clientX,
          e.clientY
        ) as HTMLElement | null;
      }
      if (justPickedRef.current) {
        justPickedRef.current = false;
        if (restore) restore();
        return;
      }
      const blocked = elementAtPoint?.closest(".message-icon, .software-icon");
      if (restore) restore();
      if (blocked) {
        isDraggingRef.current = false;
        setDragging(false);
        return;
      }
      const row = elementAtPoint?.closest(
        "[data-file-name]"
      ) as HTMLElement | null;
      if (row) {
        const name = row.dataset.fileName;
        const location = row.dataset.location;
        if (name) {
          setSelectedFile({ name, location });
        }
      }
      isDraggingRef.current = false;
      setDragging(false);
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
    isDraggingRef.current = true;
    setDragging(true);
    justPickedRef.current = true;
    setPosition({
      x: e.clientX - offsetRef.current.dx,
      y: e.clientY - offsetRef.current.dy,
    });
  };

  useEffect(() => {
    if (!currentSoftware.has("file_copier")) return;
    if (!selectedFile) return;
    setHardDrive((prev) => {
      if (prev.files.includes(selectedFile.name)) return prev;
      if (prev.files.length >= prev.capacity) return prev;
      return { ...prev, files: [...prev.files, selectedFile.name] };
    });
  }, [currentSoftware, selectedFile, setHardDrive]);

  useEffect(() => {
    if (dragging) {
      document.body.classList.add("copier-dragging");
    } else {
      document.body.classList.remove("copier-dragging");
    }
    return () => {
      document.body.classList.remove("copier-dragging");
    };
  }, [dragging]);

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel();
  };

  return (
    <div
      className={`file-copier-widget${dragging ? " dragging" : ""}`}
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={pickUp}
    >
      <span>Copier</span>
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
