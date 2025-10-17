import React, { useState } from "react";
import { api } from "../services/api";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.reset(email, token, password);
      setMsg("Password changed. You can login.");
    } catch (e: any) { setMsg(e.message); }
  }
  return (
    <section>
      <h2>Reset password</h2>
      <form onSubmit={submit}>
        <label>Correo<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Token<input value={token} onChange={e=>setToken(e.target.value)} required /></label>
        <label>Nueva contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button type="submit">Change</button>
      </form>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
