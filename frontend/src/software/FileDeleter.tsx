import React from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom, traceAtom, traceTimeAtom } from "../store";

const TraceTracker: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("file_copier");
    setCurrentSoftware(updatedSoftware);
  }

  return (
    <div className="file-copier">
      <span>File Copier</span>
      <CancelIcon onClick={handleCancel} />
    </div>
  );
};

export default TraceTracker;
