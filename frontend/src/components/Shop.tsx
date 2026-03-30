import "../styles/missions.scss";

import React, { useState } from "react";
import { useAtom } from "jotai";
import CancelIcon from "./CancelIcon";
import { moneyAtom } from "../store";

type ShopItem = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const initialItems: ShopItem[] = [
  {
    id: 1,
    name: "Undeleter",
    description: "Undeletes deleted files",
    price: 1337,
  },
  {
    id: 2,
    name: "Hard drive cleaner",
    description: "Deletes all files in hard drive, except selected files.",
    price: 420,
  },
  {
    id: 3,
    name: "Password Cracker v2",
    description: "Makes password cracker faster.",
    price: 1000,
  },
];

export function Shop({ onClose }: { onClose: () => void }) {
  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  const [money, setMoney] = useAtom(moneyAtom);
  const [items, setItems] = useState<ShopItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const handleItemClick = (item: ShopItem) => {
    setSelectedItem(item);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;
    if (money < selectedItem.price) return;
    setMoney(money - selectedItem.price);
    setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    setSelectedItem(null);
  };

  const handleReset = () => {
    setItems(initialItems);
    setSelectedItem(null);
    setMoney(1000);
  };

  const canAfford = selectedItem ? money >= selectedItem.price : false;

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
            style={{
              minHeight: "65%",
              overflow: "auto",
              padding: 0,
            }}
          >
            <div className="harddrive-bars">
              {items.length === 0 ? (
                <div style={{ padding: "8px 12px", opacity: 0.6 }}>
                  No items available
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`hd-bar${
                      selectedItem?.id === item.id ? " selected" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <span>{item.name}</span>
                  </div>
                ))
              )}
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
                {!canAfford && (
                  <div className="field-row" style={{ color: "#ff6b6b", fontSize: "0.85em" }}>
                    Insufficient funds
                  </div>
                )}
              </>
            ) : (
              "Select an item to view details"
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <div
          className="mission-action"
          onClick={handlePurchase}
          style={{ opacity: selectedItem && canAfford ? 1 : 0.5 }}
        >
          <span>Purchase</span>
        </div>
        <div
          className="mission-action shop-reset"
          onClick={handleReset}
        >
          <span className="material-icons" style={{ fontSize: "1.2em" }}>restart_alt</span>
        </div>
      </div>
    </div>
  );
}
