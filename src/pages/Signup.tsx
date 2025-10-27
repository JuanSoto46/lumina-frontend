/* The code snippet is importing necessary modules and functions for a React component. */
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import PasswordField from "../components/PasswordField";
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

  const mismatch =
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword;

  function validatePasswordStrength(password: string): string | null {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    const weak = ["123456","password","qwerty","abc123","12345678","123456789","111111","password1","123123","contraseña"];
    if (weak.includes(password.toLowerCase())) return "La contraseña es muy común. Elige otra.";
    const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|;:"<>,.?/~`]).+$/;
    if (!strong.test(password)) return "Incluye al menos una mayúscula, un número y un símbolo.";
    return null;
  }

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm({ ...form, [k]: v });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ageNum = Number(form.age);
    if (isNaN(ageNum) || ageNum < 18) {
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
    if (err) { setMsg(err); setMsgType("error"); return; }

    try {
      await api.signup({ ...form, age: ageNum });
      setMsg("Cuenta creada. Ahora puedes iniciar sesión.");
      setMsgType("success");
    } catch (e: any) {
      setMsg(e?.message || "Error al crear la cuenta.");
      setMsgType("error");
    }
  }

  return (
    <div className="login-container" role="main" aria-labelledby="signup-title" lang="es">
      <section className="login-card signup-card">
        <header className="login-logo">
          <div className="logo-circle">
            <img src="/Lumina.png" alt="Logo de Lumina" className="logo-image"/>
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
                onFocus={() => { if (form.age === "" || form.age === "0") set("age",""); }}
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
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <PasswordField
                id="password"
                label="Contraseña"
                className="login-input"
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <PasswordField
                id="confirmPassword"
                label="Confirmar contraseña"
                className="login-input"
                required
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                autoComplete="new-password"
              />
              {mismatch && (
                <p className="login-message error" role="alert">
                  Las contraseñas no coinciden.
                </p>
              )}
            </div>
          </section>

          <button type="submit" className="login-button" disabled={mismatch}>
            Crear cuenta
          </button>
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