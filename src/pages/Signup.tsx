import React, { useState } from "react";
import { api } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ firstName: "", lastName: "", age: 18, email: "", password: "" });
  const [msg, setMsg] = useState("");

  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm({ ...form, [k]: v });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.signup(form);
      setMsg("Account created. You can login now.");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <section>
      <h2>Sign up</h2>
      <form onSubmit={onSubmit}>
        <label>Nombre<input value={form.firstName} onChange={e=>set("firstName", e.target.value)} required /></label>
        <label>Apellido<input value={form.lastName} onChange={e=>set("lastName", e.target.value)} required /></label>
        <label>Edad<input type="number" min={18} value={form.age} onChange={e=>set("age", Number(e.target.value))} required /></label>
        <label>Correo<input type="email" value={form.email} onChange={e=>set("email", e.target.value)} required /></label>
        <label>Contraseña<input type="password" value={form.password} onChange={e=>set("password", e.target.value)} required /></label>
        <button type="submit">Create account</button>
      </form>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
