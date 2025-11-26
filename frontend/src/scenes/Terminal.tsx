import React, { useState } from "react";
import { useAtom } from "jotai";
import { currentNodeAtom, dataAtom, directoryAtom } from "../store";
import "../styles/terminal.scss";
import { useNavigate } from "react-router-dom";
import { loadable } from "jotai/utils";
import { useAtomValue } from "jotai";

export default function Terminal() {
    const [currentNode] = useAtom(currentNodeAtom);
    const dataLoadable = useAtomValue(loadable(dataAtom));
    const data = dataLoadable.state === "hasData" ? dataLoadable.data : [];
    const currData = data.find((node: any) => node.id === currentNode);
    const [directory, setDirectory] = useAtom(directoryAtom);
    const navigate = useNavigate();

    const handleClick = (folderId: string) => {
        const folder = currData?.directory.find((f) => f.id === folderId);
        if (folder) {
            setDirectory(folder);
            navigate(`/files`);
        }
        navigate(`/files`);
    };

    return (
        <div className="terminal">
            <h2>{currData?.name}</h2>
            {currData?.directory.map((folder, index) => (
                <div key={index} className="folder">
                    <a className="folder-name" onClick={() => handleClick(folder.id)}>
                        {folder.name}
                    </a>
                </div>
            ))}
        </div>
    );
}
