import React, { useState } from "react";
import "../styles/bottomMenu.scss";
import { useAtom } from "jotai";
import { softwareAtom, currentSoftwareAtom } from "../store";
import TraceTracker from "./TraceTracker";

const SoftwareList = () => {
    const [software] = useAtom(softwareAtom);
    const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

    return (
        <ul className="software-list">
            {software.map((item) => (
                <li
                    key={item.id}
                    onClick={() => setCurrentSoftware(prev => new Set(prev).add(item.id))}
                >
                    {item.name}
                </li>
            ))}
        </ul>
    );
}

const BottomMenu: React.FC = () => {
    const [showSoftware, setShowSoftware] = useState(false);
    const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);

    return (
        <div className="bottom-menu">
            {showSoftware && <SoftwareList />}
            <ul>
                <li className="software-icon" onClick={() => setShowSoftware(!showSoftware)}></li>
            </ul>
            {currentSoftware.has('trace_tracker') && (<TraceTracker />)}
        </div >
    );
};

export default BottomMenu;
