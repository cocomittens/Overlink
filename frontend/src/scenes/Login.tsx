import React, { useEffect, useState } from "react";
import "../styles/login.scss";
import { PasswordBreaker } from "../components/PasswordBreaker";

export default function Login() {
  const [start, setStart] = useState(false);
  const [username, setUsername] = useState("");

  const handleProceed = () => {
    setUsername("admin");
    setStart(true);
  };

  return (
    <>
      <div className="login-container">
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
      <PasswordBreaker password="rosebud" start={start} />
    </>
  );
}
