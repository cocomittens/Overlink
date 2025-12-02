import React, { useEffect, useState } from "react";
import "../styles/terminal.scss";
import { useAtom } from "jotai";
import { directoryAtom } from "../store";
import { useNavigate } from "react-router-dom";

export default function FileList() {
    const [directory] = useAtom(directoryAtom);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="files-container">
            <button
                type="button"
                className="icon-button violet"
                aria-label="Go back"
                onClick={handleBack}
            >
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
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
