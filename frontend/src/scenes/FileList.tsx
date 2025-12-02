import React, { useEffect, useState } from "react";
import "../styles/terminal.scss";
import { useAtom, useSetAtom } from "jotai";
import { currentNodeAtom, directoryAtom } from "../store";
import { useNavigate } from "react-router-dom";

export default function FileList() {
    const [directory, setDirectory] = useAtom(directoryAtom);
    const setCurrentNode = useSetAtom(currentNodeAtom);
    const navigate = useNavigate();

    const handleBack = () => {
        const prev = sessionStorage.getItem("prevComputerPath");
        if (prev && prev !== "/login" && prev !== "/agentLogin") {
            navigate(prev);
        } else {
            navigate("/");
        }
    };

    const handleDisconnect = () => {
        setCurrentNode(null);
        setDirectory({ id: "", name: "", data: [] });
        sessionStorage.setItem("prevComputerPath", "/");
        sessionStorage.setItem("lastComputerPath", "/");
        navigate("/");
    };

    return (
        <div className="files-container">
            <div className="icon-row">
                <button
                    type="button"
                    className="icon-button violet"
                    aria-label="Go back"
                    onClick={handleBack}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button
                    type="button"
                    className="icon-button cyan"
                    aria-label="Disconnect"
                    onClick={handleDisconnect}
                >
                    <span className="material-symbols-outlined">power_settings_new</span>
                </button>
            </div>
            <h2>{directory.name}</h2>
            <table>
                <thead>
                    <tr>
                        {directory.data?.map((col, index) => (
                            <th key={index}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {directory.data && directory.data.length > 0 &&
                        Array.from({ length: directory.data[0].data.length }).map(
                            (_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {directory.data.map((col, colIndex) => (
                                        <td key={colIndex}>{col.data[rowIndex]}</td>
                                    ))}
                                </tr>
                            )
                        )}
                </tbody>
            </table>
        </div>
    );
}
