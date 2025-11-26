import "../styles/missions.scss";

import React from "react";

export function Shop({ onClose }: { onClose: () => void }) {
  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="details-container">
      <>
        <div className="mission-info">
          <div className="header">Shop</div>

          <div className="large-field"></div>
        </div>
      </>
    </div>
  );
}
