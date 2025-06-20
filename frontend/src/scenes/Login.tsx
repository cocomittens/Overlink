import React, { useEffect, useState } from "react";
import "../styles/login.scss";
import { PasswordBreaker } from "../components/PasswordBreaker";
import { useAtom } from "jotai";
import { currentNodeAtom, nodesAtom } from "../store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [start, setStart] = useState(false);
  const [username, setUsername] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [currentNode] = useAtom(currentNodeAtom);
  const [nodes] = useAtom(nodesAtom);
  const [currentNodeData, setCurrentNodeData] = useState<typeof nodes[0] | undefined>(undefined);
  const [isGuessed, setIsGuessed] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const data = nodes.find((node) => node.id === currentNode);
    setCurrentNodeData(data);
  }, [nodes, currentNode]);

  const initializeBreaker = () => {
    setUsername("admin");
    setStart(true);
  };

  const handleComplete = () => {
    setIsGuessed(true);
    setPasswordMask(
      currentNodeData?.password ? "*".repeat(currentNodeData.password.length) : ""
    );
  };

  const handleProceed = () => {
    if (isGuessed) {
      navigate("/terminal");
    }
  }

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
                type="text"
                id="password"
                name="password"
                required
                onClick={initializeBreaker}
                value={passwordMask}
                readOnly
              />
            </div>
          </form>
        </div>
        <button type="submit" className={`login-button ${!isGuessed && 'disabled'}`} onClick={handleProceed}>
          Proceed
        </button>
      </div>
      <PasswordBreaker
        password={currentNodeData?.password || null}
        start={start}
        onComplete={handleComplete}
      />
    </>
  );
}
