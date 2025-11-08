import "../styles/message.scss";

import { Mission } from "../types/mission";
import React from "react";
import { useAtom } from "jotai";

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
