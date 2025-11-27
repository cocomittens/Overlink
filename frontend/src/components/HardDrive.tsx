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
          <div className="small-field">Space: 24GB</div>

          <div className="small-field">
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
