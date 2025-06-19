import React from "react";
import { useAtom } from "jotai";
import { chainAtom, currentNodeAtom, nodesAtom } from "../store";
import "../styles/map.scss";
import MapNode from "../components/MapNode";
import { useNavigate } from 'react-router-dom';

export default function Map() {
  // Retrieve nodes from Jotai store
  const [nodes] = useAtom(nodesAtom);
  const [chain, setChain] = useAtom(chainAtom);
  const [currentNode, setCurrentNode] = useAtom(currentNodeAtom);
  const navigate = useNavigate();

  const toggleNode = (id: string) => {
    setChain((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConnect = () => {
    if (chain.length < 2) {
      return;
    }
    if (currentNode) {
      setCurrentNode(null);
    } else {
      setCurrentNode(chain[chain.length - 1]);
      const nodeObj = nodes.find(n => n.id === chain[chain.length - 1]);
      if (nodeObj?.password) {
        navigate('/login');
      } else {
        navigate('/terminal');
      }

    }
  }

  const handleCancel = () => {
    setChain(['personal_gateway']);
    navigate('/');
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
        <button className="button" onClick={handleCancel}>Cancel</button>
        <button className="button" onClick={handleConnect}>{currentNode ? "Disconnect" : "Connect"}</button>
      </div>
    </div>
  );
}
