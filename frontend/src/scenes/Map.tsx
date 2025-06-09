import React, { useState } from "react";
import "../styles/map.scss";
import MapNode from "../components/MapNode";

export default function Map() {
  const nodes = [
    {
      id: "internal",
      top: 420,
      left: 300,
      name: "Internal Services",
      account: true,
    },
    {
      id: "bank",
      top: 200,
      left: 250,
      name: "International Bank",
      active: true,
      admin: true,
    },
  ];
  const [chain, setChain] = useState<string[]>([]);

  const toggleNode = (id: string) => {
    setChain((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="map-container">
      {/* SVG overlay for connecting lines */}
      <svg
        className="map-lines"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {chain.map((id, i) => {
          const nextId = chain[i + 1];
          if (!nextId) return null;
          const from = nodes.find((n) => n.id === id)!;
          const to = nodes.find((n) => n.id === nextId)!;
          const x1 = from.left + 5;
          const y1 = from.top + 5;
          const x2 = to.left + 5;
          const y2 = to.top + 5;
          return (
            <line
              key={`${id}-${nextId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#fff"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      {nodes.map((node) => (
        <MapNode
          key={node.id}
          top={node.top}
          left={node.left}
          name={node.name}
          active={node.active}
          admin={node.admin}
          account={node.account}
          onClick={() => toggleNode(node.id)}
        />
      ))}
    </div>
  );
}
