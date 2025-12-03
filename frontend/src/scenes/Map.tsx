import "../styles/map.scss";

import {
  chainAtom,
  currentNodeAtom,
  nodesAtom,
  soundEnabledAtom,
} from "../store";

import MapNode from "../components/MapNode";
import React, { useEffect, useMemo, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { getMapNodes } from "../api";

export default function Map() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [chain, setChain] = useAtom(chainAtom);
  const [currentNode, setCurrentNode] = useAtom(currentNodeAtom);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const cancelSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useAtomValue(soundEnabledAtom);
  const navigate = useNavigate();

  useEffect(() => {
    clickSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/map_node_select.mp3")
        : null;
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = 0.6;
    }
    cancelSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/cancel.wav")
        : null;
    if (cancelSoundRef.current) {
      cancelSoundRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (!soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.pause();
    }
    if (!soundEnabled && cancelSoundRef.current) {
      cancelSoundRef.current.pause();
    }
  }, [soundEnabled]);

  useEffect(() => {
    getMapNodes()
      .then((data) => setNodes(data || []))
      .catch((err) => console.error("Failed to load map nodes", err));
  }, [setNodes]);

  const nodesWithPct = useMemo(() => {
    const maxLeft = nodes.reduce((max, n) => Math.max(max, n.left || 0), 1);
    const maxTop = nodes.reduce((max, n) => Math.max(max, n.top || 0), 1);
    const overrides: Record<string, Partial<{ xPct: number; yPct: number }>> = {
      bank_1: { xPct: 30 },
      public_access_1: { xPct: 75, yPct: 45 },
      internal_1: { yPct: 70, xPct: 40 },
      internal_2: { xPct: 60, yPct: 60 },
      personal_gateway: { xPct: 20, yPct: 30 },
    };
    return nodes.map((n) => {
      const base = {
        xPct: ((n.left || 0) / maxLeft) * 100,
        yPct: ((n.top || 0) / maxTop) * 100,
      };
      const override = overrides[n.id] ?? {};
      return {
        ...n,
        xPct: override.xPct ?? base.xPct,
        yPct: override.yPct ?? base.yPct,
      };
    });
  }, [nodes]);

  const toggleNode = (id: string) => {
    if (soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
    setChain((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConnect = () => {
    console.log("handleConnect clicked", { chain, currentNode });
    // Toggle connection: disconnect if already connected
    if (currentNode) {
      console.log("disconnecting", currentNode);
      if (soundEnabled && cancelSoundRef.current) {
        cancelSoundRef.current.currentTime = 0;
        cancelSoundRef.current.play().catch(() => {});
      }
      setCurrentNode(null);
      navigate("/map");
      return;
    }
    // Connect to the last selected node
    const targetId = chain[chain.length - 1];
    if (!targetId) return;
    console.log("connecting", targetId);
    setCurrentNode(targetId);
    const nodeObj = nodes.find((n) => n.id === targetId);
    if (nodeObj?.password) {
      navigate("/login");
    } else {
      navigate("/terminal");
    }
  };

  const handleClear = () => {
    if (currentNode) return; // do nothing if connected
    setChain(["personal_gateway"]);
  };

  return (
    <div>
      <div className="map-wrapper">
        <svg
          className="map-lines"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {chain.map((id, i) => {
            const nextId = chain[i + 1];
            if (!nextId) return null;
            const from = nodesWithPct.find((n) => n.id === id);
            const to = nodesWithPct.find((n) => n.id === nextId);
            if (!from || !to) return null;
            const x1 = from.xPct;
            const y1 = from.yPct;
            const x2 = to.xPct;
            const y2 = to.yPct;
            return (
              <line
                key={`${id}-${nextId}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#fff"
                strokeWidth={0.35}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {nodesWithPct.map((node) => (
          <MapNode
            key={node.id}
            xPct={node.xPct}
            yPct={node.yPct}
            name={node.name}
            active={node.active}
            admin={node.admin}
            account={node.account}
            onClick={() => toggleNode(node.id)}
          />
        ))}
      </div>
      <div className="button-container">
        <button
          type="button"
          className={`button${currentNode ? " disabled" : ""}`}
          onClick={handleClear}
          disabled={!!currentNode}
        >
          Clear
        </button>
        <button type="button" className="button" onClick={handleConnect}>
          {currentNode ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
