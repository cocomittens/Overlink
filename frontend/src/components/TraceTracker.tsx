import React from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "./CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom } from '../store'

const TraceTracker: React.FC = () => {
    const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom)
    function handleCancel() {
        const updatedSoftware = new Set(currentSoftware);
        updatedSoftware.delete('trace_tracker');
        setCurrentSoftware(updatedSoftware)
    }
    return (
        <div className="trace-tracker">
            <span>50%</span>
            <CancelIcon onClick={handleCancel} />
        </div>
    );
};

export default TraceTracker;
