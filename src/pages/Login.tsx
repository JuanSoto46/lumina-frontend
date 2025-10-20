/**
 * The `Login` component in TypeScript React handles user authentication by allowing users to input
 * their email and password to log in to their account.
 * @param e - In the code snippet you provided, the parameter `e` is used as an event object in the
 * `onSubmit` function. It represents the event that is being handled, specifically a `React.FormEvent`
 * in this case. This event object is used to prevent the default form submission behavior using `
 */

// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

type Props = { onAuth?: () => void };

export default function Login({ onAuth }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.login(email, password);
      onAuth?.();
      setMsg("Inicio de sesión exitoso.");
      navigate("/pexels");
    } catch (e: any) {
      setMsg(e.message || "Error al iniciar sesión.");
    }
  }

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  return (
    <main className="login-container" role="main" aria-labelledby="login-title">
      <section className="login-card" aria-describedby="login-description">
        <div className="login-logo">
          <div className="logo-circle">
            <img src="/Lumina.png" alt="Logo de Lumina" className="logo-image" />
          </div>
        </div>

        <h1 id="login-title" className="label">Iniciar sesión en Lumina</h1>
        <p id="login-description" className="label">
          Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.
        </p>

        <form onSubmit={onSubmit} className="login-form" aria-label="Formulario de inicio de sesión">
          <div className="input-group">
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <button type="submit" className="login-button" aria-label="Ingresar a tu cuenta">
            Ingresar
          </button>
        </form>

        <nav className="login-links" aria-label="Enlaces de ayuda">
          <Link to="/forgot" className="forgot-link">¿Olvidaste tu contraseña?</Link>
          <p className="signup-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="signup-link">Regístrate aquí</Link>
          </p>
        </nav>

        {msg && (
          <p role="status" aria-live="polite" className="login-message">
            {msg}
          </p>
        )}
      </section>
    </main>
  );
}
