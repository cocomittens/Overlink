import React, { useEffect, useState } from "react";
import "../styles/missions.scss";
import { useAtom } from "jotai";
import { directoryAtom } from "../store";

export default function FileList() {
    const [directory] = useAtom(directoryAtom);
    console.log(directory.data)
    return (
        <div className="files-container">
            <h2>Available Files</h2>
            <table>
                <thead>
                    <tr>
                        {directory.data?.map((file, index) => (
                            <th key={index}>
                                {file.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {directory.data?.map((file, index) => (
                        <tr key={index} style={{ display: "flex", flexDirection: "column" }}>
                            {file.data?.map((item, idx) => (
                                <td key={idx}>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
