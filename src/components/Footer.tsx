import React from "react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <strong>Site map:</strong>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign up</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/forgot">Forgot</Link></li>
          <li><Link to="/reset">Reset</Link></li>
        </ul>
        <p>© 2025 Lumina. Accessible contrast, focus-visible, labeled forms.</p>
      </div>
    </footer>
  );
}
