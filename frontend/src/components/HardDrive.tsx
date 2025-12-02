import "../styles/missions.scss";

import React from "react";
import { useAtomValue } from "jotai";
import { hardDriveAtom } from "../store";

export function HardDrive({
  onClose,
  barCount = 10,
}: {
  onClose: () => void;
  barCount?: number;
}) {
  const hardDrive = useAtomValue(hardDriveAtom);

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="details-container">
      <div
        className="mission-info"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "1%",
        }}
      >
        <div
          className="header"
          style={{
            paddingTop: "1%",
          }}
        >
          Hard Drive
        </div>
        <div className="small-field">
          Space: {hardDrive.capacity}GB, Files: {hardDrive.files.length}
        </div>

        <div className="harddrive-bars">
          {Array.from({
            length: hardDrive.capacity || barCount,
          }).map((_, idx) => {
            const fileName = hardDrive.files[idx] ?? "";
            const filled = idx < hardDrive.files.length;
            return (
              <div
                key={idx}
                className={`hd-bar ${filled ? "selected" : ""}`}
                data-file-name={filled ? fileName : undefined}
                data-location="hard_drive"
              >
                {fileName}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
