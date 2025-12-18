import "../styles/message.scss";

import { Mission } from "../types/mission";

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
