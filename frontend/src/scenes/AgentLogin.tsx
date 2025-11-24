import "../styles/login.scss";

import React, { useState } from "react";
import SavedUserList, { SavedUser } from "../components/SavedUserList";
import { useAtom } from "jotai";
import { userAtom } from "../store";
import { login as apiLogin } from "../api";
import { useNavigate } from "react-router-dom";

export default function AgentLogin() {
  const savedUsers: SavedUser[] = [{ username: "demo", password: "demo" }];
  const [user, setUser] = useAtom(userAtom);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUserSelect = (user: SavedUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setPasswordMask("*".repeat(user.password.length));
    setSelectedUser(user.username);
    setError(null);
  };

  const handleProceed = async () => {
    if (user) {
      setError("error: user already logged in");
      return;
    }
    if (!username || !password) {
      setError("Select a user to login");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      if (data?.success) {
        setUser(data.user);
        navigate("/terminal");
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (e) {
      setError("Login failed");
    } finally {
      setIsSubmitting(false);
    }
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
        {error && <div className="login-error">{error}</div>}
        <button
          type="submit"
          className={`login-button ${isSubmitting ? "disabled" : ""}`}
          onClick={handleProceed}
          disabled={isSubmitting}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
