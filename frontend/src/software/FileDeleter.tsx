import React from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "../components/CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom, traceAtom, traceTimeAtom } from "../store";

const FileDeleter: React.FC = () => {
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

  function handleCancel() {
    const updatedSoftware = new Set(currentSoftware);
    updatedSoftware.delete("file_copier");
    setCurrentSoftware(updatedSoftware);
  }

  return (
    <div className="file-deleter">
      <span>File Deleter</span>
      <CancelIcon onClick={handleCancel} />
    </div>
  );
};

export default FileDeleter;
