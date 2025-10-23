/* The code snippet is importing necessary modules and functions for a React component. */
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

/**
 * The `Signup` function in TypeScript React handles user registration by capturing personal
 * information and access credentials, performing validation checks, and displaying relevant messages
 * to the user.
 * @param {K} k - The parameter `k` in the `set` function is a generic type `K` that extends the keys
 * of the `form` object. This means that `k` can only be one of the keys of the `form` object, which
 * are `firstName`, `lastName`, `age`,
 * @param {any} v - The `v` parameter in the `set` function represents the new value that you want to
 * set for a specific key in the `form` state object. It is used to update the state by creating a new
 * object with the updated value for the specified key.
 */
export default function Signup() {
  /* The code snippet is using the `useState` hook from React to create two state variables within the
  `Signup` component: */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  function validatePasswordStrength(password: string): string | null {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    const weakPasswords = [
      "123456", "password", "qwerty", "abc123",
      "12345678", "123456789", "111111", "password1",
      "123123", "contraseña"
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      return "La contraseña es muy común. Por favor elija otra.";
    }
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|;:"<>,.?/~`]).+$/;
    if (!strongRegex.test(password)) {
      return "La contraseña debe incluir al menos una letra mayúscula, un número y un símbolo..";
    }
    return null;
  }


  /* The `useEffect` hook in the provided code snippet is used to add a CSS class to the `body` element
  of the document when the `Signup` component mounts, and then remove that class when the component
  unmounts. */
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
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
   * The function onSubmit handles form submission in a TypeScript React component, performing
   * validation checks and calling an API to sign up a user.
   * @param e - The parameter `e` in the `onSubmit` function is a React.FormEvent. It is an event
   * object that represents a form submission event in React. In this case, the function is handling
   * the form submission event to validate the form data before sending it to the server for signup.
   * @returns The `onSubmit` function is returning different messages based on the conditions met
   * during form submission. If the user's age is less than 18, it returns a message stating "You must
   * be at least 18 years old to register." If the passwords do not match, it returns a message saying
   * "The passwords do not match." If the signup process is successful, it returns "Account created.
   */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ageNum = Number(form.age);

    if (Number(form.age) < 18 || isNaN(Number(form.age))) {
      setMsg("Debes tener al menos 18 años para registrarte.");
      setMsgType("error");
      return;
    }


    if (form.password !== form.confirmPassword) {
      setMsg("Las contraseñas no coinciden.");
      setMsgType("error");
      return;
    }

    const err = validatePasswordStrength(form.password);
    if (err) {
      setMsg(err);
      return;
    }

    try {
      const formData = {
        ...form,
        age: Number(form.age) // Convertir age a número para la API
      };
      await api.signup(formData);
      setMsg("Cuenta creada. Ahora puedes iniciar sesión.");
      setMsgType("success");
    } catch (e: any) {
      setMsg(e.message || "Error al crear la cuenta.");
      setMsgType("error");
    }
  }

  return (
    <div className="login-container" role="main" aria-labelledby="signup-title" lang="es">
      <section className="login-card signup-card">
        <header className="login-logo">
          <div className="logo-circle">
            <img
              src="/Lumina.png"
              alt="Logo de Lumina"
              className="logo-image"
            />
          </div>
        </header>

        <h1 id="signup-title" className="sr-only">Crear cuenta en Lumina</h1>

        <form onSubmit={onSubmit} className="login-form" aria-describedby="signup-status">
          {/* Información personal */}
          <section aria-label="Información personal">
            <div className="input-group">
              <label htmlFor="firstName" className="sr-only">Nombre</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Nombre"
                required
                aria-required="true"
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName" className="sr-only">Apellido</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Apellido"
                required
                aria-required="true"
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="age" className="sr-only">Edad</label>
              <input
                id="age"
                type="number"
                min={18}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                onFocus={(e) => {
                  // Si el campo está vacío o es "0", limpiar al hacer foco
                  if (form.age === "" || form.age === "0") {
                    set("age", "");
                  }
                }}
                placeholder="Edad (mínimo 18 años)"
                required
                aria-required="true"
                className="login-input"
              />
            </div>
          </section>

          {/* Credenciales de acceso */}
          <section aria-label="Credenciales de acceso">
            <div className="input-group">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="Correo electrónico"
                required
                aria-required="true"
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Contraseña"
                required
                aria-required="true"
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                placeholder="Confirmar contraseña"
                required
                aria-required="true"
                className="login-input"
              />
            </div>
          </section>

          <button type="submit" className="login-button">Crear cuenta</button>
        </form>

        <nav className="login-links">
          <p className="signup-text">
            <a href="/login" className="signup-link">Regresar al principio</a>
          </p>
        </nav>

        {msg && (
          <p id="signup-status" role="status" className={`login-message ${msgType}`}>
            {msg}
          </p>
        )}
      </section>
    </div>
  );
}
