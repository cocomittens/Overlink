import React from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "./CancelIcon";

const TraceTracker: React.FC = () => {
    return (
        <div className="trace-tracker">
            <span>50%</span>
            <CancelIcon />
        </div>
    );
};

export default TraceTracker;
