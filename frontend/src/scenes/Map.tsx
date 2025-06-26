import React from "react";
import { useAtom } from "jotai";
import { chainAtom, currentNodeAtom, nodesAtom } from "../store";
import "../styles/map.scss";
import MapNode from "../components/MapNode";
import { useNavigate } from 'react-router-dom';

export default function Map() {
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
    console.log('handleConnect clicked', { chain, currentNode });
    // Toggle connection: disconnect if already connected
    if (currentNode) {
      console.log('disconnecting', currentNode);
      setCurrentNode(null);
      navigate('/map'); // go back to map on disconnect
      return;
    }
    // Connect to the last selected node
    const targetId = chain[chain.length - 1];
    if (!targetId) return;
    console.log('connecting', targetId);
    setCurrentNode(targetId);
    const nodeObj = nodes.find((n) => n.id === targetId);
    if (nodeObj?.password) {
      navigate('/login');
    } else {
      navigate('/terminal');
    }
  };

  const handleCancel = () => {
    console.log('handleCancel clicked');
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
            const from = nodes.find((n) => n.id === id);
            const to = nodes.find((n) => n.id === nextId);
            if (!from || !to) return null;
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
        <button type="button" className="button" onClick={handleCancel}>Cancel</button>
        <button type="button" className="button" onClick={handleConnect}>{currentNode ? "Disconnect" : "Connect"}</button>
      </div>
    </div>
  );
}
