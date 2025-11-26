import "../styles/missions.scss";

import React from "react";

export function HardDrive({ onClose }: { onClose: () => void }) {
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

          <div className="large-field"></div>
        </div>
      </>
    </div>
  );
}
