import React from "react";
import { useAtom } from "jotai";
import { Mission } from "../types/mission";
import "../styles/message.scss";

export default function Message({
  selectedMission,
}: {
  selectedMission: Mission | null;
}) {
  return (
    <div className="message-container">
      {selectedMission && "Welcome to the game."}
    </div>
  );
}
