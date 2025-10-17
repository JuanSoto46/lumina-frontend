import React, { useState } from "react";
import { api } from "../services/api";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.forgot(email);
      setMsg("If the email exists, a reset link was sent.");
    } catch (e: any) { setMsg(e.message); }
  }
  return (
    <section>
      <h2>Forgot password</h2>
      <form onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <button type="submit">Send reset link</button>
      </form>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
