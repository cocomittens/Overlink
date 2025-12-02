import React, { useEffect, useRef, useState } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom, hardDriveAtom, selectedFileAtom } from "../store";

const FileDeleter: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const [hardDrive, setHardDrive] = useAtom(hardDriveAtom);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth * 0.78 : 0,
    y: typeof window !== "undefined" ? window.innerHeight * 0.75 : 0,
  });
  const [dragging, setDragging] = useState(true);
  const isDraggingRef = useRef(true);
  const justPickedRef = useRef(false);
  const offsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("file_deleter");
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
      const elementAtPoint = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      if (justPickedRef.current) {
        justPickedRef.current = false;
        if (elementAtPoint?.closest(".file-deleter-widget")) return;
      }
      const blocked = elementAtPoint?.closest(".message-icon, .software-icon");
      if (blocked) return;
      const row = elementAtPoint?.closest("[data-file-name]") as HTMLElement | null;
      if (row) {
        const name = row.dataset.fileName;
        const location = row.dataset.location;
        if (name) {
          setSelectedFile({ name, location });
          setHardDrive((prev) => {
            if (!prev.files.includes(name)) return prev;
            const nextFiles = prev.files.filter((f, idx) => {
              if (f !== name) return true;
              // remove first match only
              const alreadyRemoved = prev.files.indexOf(name) !== idx;
              return alreadyRemoved;
            });
            return { ...prev, files: nextFiles };
          });
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

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel();
  };

  return (
    <div
      className={`file-copier-widget file-deleter-widget${dragging ? " dragging" : ""}`}
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={pickUp}
    >
      <span>Deleter</span>
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

export default FileDeleter;
