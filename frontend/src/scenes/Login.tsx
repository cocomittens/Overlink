import React, { useEffect, useState } from "react";
import "../styles/login.scss";
import { PasswordBreaker } from "../components/PasswordBreaker";

export default function Login() {
  return (
    <>
      <div className="login-container">
        <div className="login-form">
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
        <button type="submit" className="login-button">
          Proceed
        </button>
      </div>
      <PasswordBreaker password="rosebud" />
    </>
  );
}
