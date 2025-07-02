import React, { useEffect } from "react";
import "../styles/bottomMenu.scss";
import CancelIcon from "./CancelIcon";
import { useAtom } from "jotai";
import { currentSoftwareAtom, traceAtom, traceTimeAtom } from '../store'

const TraceTracker: React.FC = () => {
    const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
    const [trace, setTrace] = useAtom(traceAtom);
    const [traceTime, setTraceTime] = useAtom(traceTimeAtom)

    function handleCancel() {
        const updatedSoftware = new Set(currentSoftware);
        updatedSoftware.delete('trace_tracker');
        setCurrentSoftware(updatedSoftware);
        setTrace(0);
    }

    function handleTrace(time_remaining: number) {
        const startTime = Date.now();
        const endTime = startTime + time_remaining;

        const updateTrace = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / time_remaining) * 100, 100);

            setTrace(progress);

            if (progress < 100) {
                requestAnimationFrame(updateTrace);
            }
        };

        updateTrace();
    }

    useEffect(() => {
        if (traceTime > 0) {
            handleTrace(traceTime)
        }
    }, [traceTime]);

    return (
        <div className="trace-tracker">
            <span>{Math.round(trace)}%</span>
            <CancelIcon onClick={handleCancel} />
        </div>
    );
};

export default TraceTracker;
