import React, { useEffect, useState } from "react";
import "../styles/login.scss";

export function PasswordBreaker({ password }: { password: string | null }) {
  return (
    <div className="password-breaker-container">
      <p>Password Breaker</p>
      <span>{password}</span>
    </div>
  );
}
