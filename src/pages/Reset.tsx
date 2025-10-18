/* The code snippet is importing necessary modules and functions from the React library and a custom
API service file. */
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

/**
 * The `Reset` function in TypeScript React is a component that allows users to reset their password by
 * providing their email, token, and new password, displaying a message upon successful password
 * change.
 * @param {K} k - The parameter `k` in the `set` function is a generic type `K` that extends the keys
 * of the `form` object. This means that `k` can only be one of the keys present in the `form` object,
 * which are `email`, `token`, and `
 * @param {any} v - The `v` parameter in the `set` function represents the new value that you want to
 * set for a specific key in the `form` state object. It is used to update the state by creating a new
 * object with the updated value for the specified key.
 */
export default function Reset() {
  /* The code snippet is using the `useState` hook from React to create two state variables: `form` and
  `msg`. */
  const [form, setForm] = useState({ email: "", token: "", password: "" });
  const [msg, setMsg] = useState("");

  /* The `useEffect` hook in the code snippet is used to perform side effects in a functional
  component. In this specific case: */
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  /**
   * The function `set` updates a specific key-value pair in an object using TypeScript and React.
   * @param {K} k - The parameter `k` is a key of the `form` object.
   * @param {any} v - The parameter `v` in the `set` function represents the value that you want to set
   * for a specific key in the `form` object.
   */
  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm({ ...form, [k]: v });
  }

  /**
   * The function onSubmit handles form submission in a TypeScript React component, resetting a user's
   * password using an API call and displaying a success message or error message accordingly.
   * @param e - The parameter `e` in the `onSubmit` function is a React.FormEvent object representing
   * the form submission event. It is used to prevent the default form submission behavior using
   * `e.preventDefault()`.
   */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.reset(form.email, form.token, form.password);
      setMsg("Password changed successfully. You can login now.");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <div className="login-container" role="main" aria-labelledby="reset-title" lang="es">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-circle">
            <img
              src="../public/Lumina.png"
              alt="Logo de Lumina"
              className="logo-image"
            />
          </div>
        </div>

        <h2 id="reset-title" className="label">
          Reset Password
        </h2>

        <form onSubmit={onSubmit} className="login-form" aria-describedby="reset-status">
          <div className="input-group">
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="Correo electrónico"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="token" className="label">Token</label>
            <input
              id="token"
              value={form.token}
              onChange={(e) => set("token", e.target.value)}
              placeholder="Token"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="label">Nueva contraseña</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Nueva contraseña"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <button type="submit" className="login-button">
            Cambiar contraseña
          </button>
        </form>

        <div className="login-links">
          <p className="signup-text">
            <a href="/login" className="signup-link">Volver al inicio</a>
          </p>
        </div>

        {msg && (
          <p id="reset-status" role="status" className="login-message">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
