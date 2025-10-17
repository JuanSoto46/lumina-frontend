import React, { useState } from "react";
import { useNavigate } from "react-router";
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
      setMsg("Logged in.");
      navigate("/profile");
    } catch (e: any) {
      setMsg(e.message || "Login failed");
    }
  }

  return (
    <section>
      <h2>Inicio de sesión</h2>
      <form onSubmit={onSubmit} aria-describedby="login-help">
        <label>Correo 
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button type="submit">Iniciar sesión</button>
      </form>
      <p id="login-help"><a href="/forgot">¿Olvidaste tu contraseña?</a></p>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
