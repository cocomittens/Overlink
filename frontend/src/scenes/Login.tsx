import React, { useEffect, useState } from "react";
import "../styles/login.scss";

export default function Login() {
  return (
    <div className="login-container">
      <h2>User Authorization Required</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Code</label>
          <input type="password" id="password" name="password" required />
        </div>
      </form>
    </div>
  );
}
