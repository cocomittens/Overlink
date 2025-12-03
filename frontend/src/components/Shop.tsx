import "../styles/missions.scss";

import React, { useState } from "react";
import CancelIcon from "./CancelIcon";

export function Shop({ onClose }: { onClose: () => void }) {
  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  const placeholderItems = [
    { id: 1, name: "item1", description: "description1", price: 1337 },
    { id: 2, name: "item2", description: "description2", price: 420 },
    { id: 3, name: "item3", description: "description3", price: 1000 },
  ];

  const [selectedItem, setSelectedItem] = useState<
    (typeof placeholderItems)[number] | null
  >(null);

  const handleItemClick = (item: (typeof placeholderItems)[number]) => {
    setSelectedItem(item);
  };

  return (
    <div className="details-container shop">
      <div
        className="mission-info"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "1%",
        }}
      >
        <div className="header" style={{ paddingTop: "1%" }}>
          <span>Shop</span>
          <CancelIcon onClick={handleClose} aria-label="Close shop" />
        </div>
        <div className="mission-info-body">
          <div
            className="small-field"
            style={{ minHeight: "65%", overflow: "auto" }}
          >
            <div className="harddrive-bars">
              {placeholderItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`hd-bar${
                    selectedItem?.id === item.id ? " selected" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="small-field" style={{ minHeight: "30%" }}>
            {selectedItem ? (
              <>
                <div className="field-row">
                  <strong>{selectedItem.name}</strong>
                </div>
                <div className="field-row">Price: ${selectedItem.price}</div>
                <div className="field-row">{selectedItem.description}</div>
              </>
            ) : (
              "Select an item to view details"
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <div className="mission-action">
          <span>Purchase</span>
        </div>
      </div>
    </div>
  );
}
