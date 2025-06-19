import React, { useEffect, useState } from "react";
import "../styles/login.scss";
import { PasswordBreaker } from "../components/PasswordBreaker";
import { useAtom } from "jotai";
import { currentNodeAtom, nodesAtom } from "../store";

export default function Login() {
  const [start, setStart] = useState(false);
  const [username, setUsername] = useState("");
  const currentNode = useAtom(currentNodeAtom)[0];
  const nodes = useAtom(nodesAtom)[0];
  const [currentNodeData, setCurrentNodeData] = useState<typeof nodes[0] | undefined>(undefined);

  useEffect(() => {
    console.log(currentNode);
    const data = nodes.find((node) => node.id === currentNode);
    setCurrentNodeData(data);
    console.log(data)
  }, [nodes, currentNode]);

  const handleProceed = () => {
    setUsername("admin");
    setStart(true);
  };

  return (
    <>
      <div className="login-container">
        <h2>{currentNode}</h2>
        <div className="login-form">
          <h2>User Authorization Required</h2>
          <form>
            <div className="form-group">
              <label htmlFor="username">Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Code</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onClick={handleProceed}
              />
            </div>
          </form>
        </div>
        <button type="submit" className="login-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
      <PasswordBreaker password={currentNodeData?.password || null} start={start} />
    </>
  );
}
