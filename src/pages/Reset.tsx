// src/pages/Reset.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Reset() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token") || ""; // viene del link del correo

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  // mantener tu clase de página si te gusta la decoración
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => { document.body.classList.remove("login-page"); };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMsg("Falta token. Abre el enlace desde tu correo nuevamente.");
      setMsgType("error");
      return;
    }

    if (password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres.");
      setMsgType("error");
      return;
    }

    // 🔒 Nueva validación: evitar contraseñas débiles
    const weakPasswords = ["123456", "password", "qwerty", "abc123"];
    if (weakPasswords.includes(password.toLowerCase())) {
      setMsg("La contraseña es demasiado común. Elige otra.");
      return;
    }

    if (password !== confirm) {
      setMsg("Las contraseñas no coinciden.");
      setMsgType("error");
      return;
    }

    try {
      await api.reset(token, password, confirm); // api.reset(token, password, confirmPassword)
      setMsg("Contraseña actualizada. Redirigiendo al inicio de sesión…");
      setMsgType("success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (e: any) {
      setMsg(e.message || "Error al restablecer.");
      setMsgType("error");
    }
  }

  return (
    <div className="login-container" role="main" aria-labelledby="reset-title" lang="es">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-circle">
            {/* En Vite, /public se sirve desde la raíz */}
            <img src="/Lumina.png" alt="Logo de Lumina" className="logo-image" />
          </div>
        </div>

        <h2 id="reset-title" className="label">Restablecer contraseña</h2>

        <form onSubmit={onSubmit} className="login-form" aria-describedby="reset-status">
          <div className="input-group">
            <label htmlFor="password" className="label">Nueva contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              required
              className="login-input"
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm" className="label">Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar contraseña"
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
          <p id="reset-status" role="status" className={`login-message ${msgType}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
