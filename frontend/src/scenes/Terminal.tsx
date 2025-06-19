import React from "react";
import { useAtom } from "jotai";
import { currentNodeAtom } from "../store";
import "../styles/terminal.scss";

export default function Terminal() {
    const [currentNode] = useAtom(currentNodeAtom);
    return (
        <div className="terminal">
            {currentNode ? (
                <div>
                    <h2>Connected to {currentNode}</h2>
                </div>
            ) : (
                <div>
                    <h2>No Active Connection</h2>
                </div>
            )}
        </div>
    );
}