/* The code snippet is importing necessary modules and functions from the React library and a custom
API service file. */
// src/pages/Forgot.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.forgot(email);
      setMsg("Si el correo existe, se ha enviado un enlace de recuperación.");
      setMsgType("success");
    } catch (e: any) {
      // Traducir mensajes de error comunes al español
      let errorMessage = e.message || "Error al enviar el enlace.";
      
      if (errorMessage.includes("Email required")) {
        errorMessage = "El correo electrónico es obligatorio.";
      } else if (errorMessage.includes("Email service error")) {
        errorMessage = "Error del servicio de correo. Intenta nuevamente más tarde.";
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
      } else if (errorMessage.includes("500")) {
        errorMessage = "Error del servidor. Intenta nuevamente más tarde.";
      }
      
      setMsg(errorMessage);
      setMsgType("error");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-circle">
            <img src="/Lumina.png" alt="Lumina" className="logo-image" />
          </div>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="label">
              Ingrese su correo electrónico para recuperar su contraseña
            </label>
            <input
              id="email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Correo electrónico"
            />
          </div>

          <button type="submit" className="login-button">Enviar enlace</button>
        </form>

        <div className="login-links">
          <p className="signup-text">
            <Link to="/login" className="signup-link">Volver al inicio</Link>
          </p>
        </div>

        {msg && <p role="status" className={`login-message ${msgType}`}>{msg}</p>}
      </div>
    </div>
  );
}
