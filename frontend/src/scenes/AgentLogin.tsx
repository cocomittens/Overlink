import "../styles/login.scss";

import React, { useEffect, useState } from "react";

export default function AgentLogin() {
  return (
    <>
      <div className="login-container">
        <h2>Agent Login</h2>
        <div className="login-form">
          <h2>User Authorization Required</h2>
          <form>
            <div className="form-group">
              <label htmlFor="username">Name</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Code</label>
              <input
                type="text"
                id="password"
                name="password"
                required
                readOnly
              />
            </div>
          </form>
        </div>
        <button type="submit" className={`login-button`}>
          Proceed
        </button>
      </div>
    </>
  );
}
