/* The code snippet is importing necessary modules and functions from the React library and a custom
API service file. */
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

/**
 * The `Forgot` function is a React component that handles the process of sending a password recovery
 * email to a user based on their input email address.
 * @returns The `Forgot` component is being returned. It is a functional component that contains a form
 * for users to input their email to receive a password recovery link. The component includes state
 * variables for email and message, useEffect to add/remove a class from the body element, and a submit
 * function to handle form submission. The form includes an input field for email, a submit button, and
 * a message display area for
 */
export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  /* The `useEffect` hook in the `Forgot` component is used to add a CSS class to the `body` element
  when the component mounts, and remove that class when the component unmounts. */
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  /**
   * The function `submit` is an asynchronous function in TypeScript React that handles form submission
   * by calling an API to send a password recovery email and updating the message displayed based on
   * the outcome.
   * @param e - The parameter `e` in the `submit` function is a React.FormEvent. This event is
   * typically triggered when a form is submitted in a React component. In this case, the `submit`
   * function is handling the form submission and preventing the default form submission behavior using
   * `e.preventDefault()`.
   */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.forgot(email);
      setMsg("Si el correo existe, se ha enviado un enlace de recuperación.");
    } catch (e: any) {
      setMsg(e.message || "Error al enviar el enlace.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-circle">
            {/* ✅ Ruta corregida para Vite */}
            <img src="/Lumina.png" alt="Lumina" className="logo-image" />
          </div>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="input-group">
            {/* ✅ Label accesible y oculto */}
            <label htmlFor="email" className="label">
              Ingrese su correo electronico para recuperrar su contraseña
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

          <button type="submit" className="login-button">
            Enviar enlace
          </button>
        </form>

        <div className="login-links">
          <p className="signup-text">
            <a href="/login" className="signup-link">
              Volver al inicio
            </a>
          </p>
        </div>

        {/* ✅ Mensaje accesible con role="status" */}
        {msg && <p role="status" className="login-message">{msg}</p>}
      </div>
    </div>
  );
}
