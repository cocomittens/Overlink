import "../styles/login.scss";

import React, { useState } from "react";
import SavedUserList, { SavedUser } from "../components/SavedUserList";

export default function AgentLogin() {
  const savedUsers: SavedUser[] = [{ username: "demo", password: "demo" }];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserSelect = (user: SavedUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setPasswordMask("*".repeat(user.password.length));
    setSelectedUser(user.username);
  };

  return (
    <div className="login-page">
      <SavedUserList
        users={savedUsers}
        onSelect={handleUserSelect}
        selectedUsername={selectedUser}
      />
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
                type="text"
                id="password"
                name="password"
                value={passwordMask}
                readOnly
                required
              />
            </div>
          </form>
        </div>
        <button type="submit" className={`login-button`}>
          Proceed
        </button>
      </div>
    </div>
  );
}
