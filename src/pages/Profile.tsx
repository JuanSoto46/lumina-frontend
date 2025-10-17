import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Profile() {
  const [me, setMe] = useState<any>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const data = await api.me();
      setMe(data);
    } catch (e: any) { setMsg(e.message); }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    try {
      const updated = await api.updateMe({ firstName: me.firstName, lastName: me.lastName, age: me.age, email: me.email });
      setMe(updated);
      setMsg("Updated.");
    } catch (e: any) { setMsg(e.message); }
  }

  async function kill() {
    try {
      await api.deleteMe();
      api.logout();
      setMsg("Account deleted.");
    } catch (e: any) { setMsg(e.message); }
  }

  if (!localStorage.getItem("token")) return <p>Please login first.</p>;
  if (!me) return <p>Loading profile...</p>;

  return (
    <section>
      <h2>Profile</h2>
      <label>First name<input value={me.firstName} onChange={e=>setMe({ ...me, firstName: e.target.value })} /></label>
      <label>Last name<input value={me.lastName} onChange={e=>setMe({ ...me, lastName: e.target.value })} /></label>
      <label>Age<input type="number" value={me.age} onChange={e=>setMe({ ...me, age: Number(e.target.value) })} /></label>
      <label>Email<input value={me.email} onChange={e=>setMe({ ...me, email: e.target.value })} /></label>
      <div style={{ display:"flex", gap: 8, marginTop: 12 }}>
        <button onClick={save}>Save</button>
        <button onClick={() => { api.logout(); setMsg("Logged out."); }}>Logout</button>
        <button onClick={kill}>Delete account</button>
      </div>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
