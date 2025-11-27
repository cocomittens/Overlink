import "../styles/missions.scss";

import React from "react";

export function HardDrive({
  onClose,
  barCount = 10,
}: {
  onClose: () => void;
  barCount?: number;
}) {
  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="details-container">
      <>
        <div className="mission-info">
          <div className="header">Hard Drive</div>
          <div className="small-field">Space: 24GB</div>

          <div className="large-field">
            <div className="harddrive-bars">
              {Array.from({ length: barCount }).map((_, idx) => (
                <div key={idx} className="hd-bar" />
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
