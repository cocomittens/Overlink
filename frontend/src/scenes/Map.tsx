import React from "react";
import { useAtom } from "jotai";
import { chainAtom } from "../store";
import "../styles/map.scss";
import MapNode from "../components/MapNode";

export default function Map() {
  const nodes = [
    { id: "personal_gateway", top: 280, left: 190, name: "Gateway", admin: true },
    {
      id: "sample_internal",
      top: 450,
      left: 350,
      name: "Sample Internal Services",
      account: true,
    },
    {
      id: "sample_bank",
      top: 200,
      left: 250,
      name: "Sample International Bank",
      active: true,
      admin: true,
    },
    {
      id: "sample_public_access",
      top: 300,
      left: 800,
      name: "Sample Public Access Server",
    }
  ];
  const [chain, setChain] = useAtom(chainAtom);

  const toggleNode = (id: string) => {
    setChain((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="map-container">
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
      <div className="button-container">
        <button className="button">Cancel</button>
        <button className="button">Connect</button>
      </div>
    </div>
  );
}
