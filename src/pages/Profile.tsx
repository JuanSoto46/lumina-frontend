
/* The `import React, { useEffect, useState } from "react";` statement is importing the necessary
modules from the React library. Specifically, it is importing the `useEffect` and `useState` hooks
from React, which are essential for managing side effects and state in functional components. */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

/**
 * The `Profile` function in TypeScript React handles user profile management including loading,
 * updating, and deleting user information with error handling and user feedback.
 * @returns The `Profile` component is being returned. It includes a form for editing user profile
 * information such as first name, last name, age, and email. It also has buttons for saving changes,
 * logging out, and deleting the account. Additionally, there are messages displayed based on actions
 * taken, such as updating the profile, logging out, or deleting the account.
 */
export default function Profile() {
  /* The code snippet `const [me, setMe] = useState<any>(null);` and `const [msg, setMsg] =
  useState("");` in the Profile component is utilizing the `useState` hook from React to manage
  state within a functional component. */
  const [me, setMe] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  /**
   * The function `load` asynchronously fetches user data from an API and sets the retrieved data to
   * the state variable `me`, while handling any errors by setting an error message in the state
   * variable `msg`.
   */
  async function load() {
    try {
      const data = await api.me();
      setMe(data);
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  /* The `useEffect(() => { load(); }, []);` code snippet in the `Profile` component is utilizing the
  `useEffect` hook from React. This hook is used to perform side effects in functional components. */
  useEffect(() => {
    load();
  }, []);

  /**
   * The function `save` updates user profile information using an API call and displays a success
   * message if the update is successful, or an error message if there is an error.
   */
  async function save() {
    try {
      const updated = await api.updateMe({
        firstName: me.firstName,
        lastName: me.lastName,
        age: me.age,
        email: me.email,
      });
      setMe(updated);
      setMsg("Perfil actualizado correctamente ✅");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  /**
   * The function `kill` attempts to delete a user account using an API call and displays a success
   * message if successful, or an error message if an exception occurs.
   */
  async function kill() {
    try {
      await api.deleteMe();
      api.logout();
      setMsg("Cuenta eliminada.");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  /* The code snippet `if (!localStorage.getItem("token")) return <p>Por favor inicia sesión
  primero.</p>; if (!me) return <p>Cargando perfil...</p>;` in the `Profile` component is performing
  two checks: */
  if (!localStorage.getItem("token")) return <p>Por favor inicia sesión primero.</p>;
  if (!me) return <p>Cargando perfil...</p>;

  return (
    <section
      className="profile-page"
      role="region"
      aria-labelledby="profile-title"
      lang="es"
    >
      <div className="profile-card">
        <h2 id="profile-title">Mi Perfil</h2>

        <form
          className="profile-form"
          onSubmit={(e) => e.preventDefault()}
          aria-describedby="profile-message"
        >
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            value={me.firstName}
            onChange={(e) => setMe({ ...me, firstName: e.target.value })}
            placeholder="Tu nombre"
            aria-required="true"
          />

          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            value={me.lastName}
            onChange={(e) => setMe({ ...me, lastName: e.target.value })}
            placeholder="Tu apellido"
            aria-required="true"
          />

          <label htmlFor="age">Edad</label>
          <input
            id="age"
            type="number"
            value={me.age}
            onChange={(e) => setMe({ ...me, age: Number(e.target.value) })}
            placeholder="Tu edad"
            aria-required="true"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={me.email}
            onChange={(e) => setMe({ ...me, email: e.target.value })}
            placeholder="Tu correo electrónico"
            aria-required="true"
          />

          <div className="profile-buttons" role="group" aria-label="Acciones de perfil">
            <button type="button" className="btn-primary" onClick={save}>
              Guardar
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/settings/password')}
            >
              Cambiar contraseña
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                api.logout();
                setMsg("Sesión cerrada.");
              }}
            >
              Cerrar sesión
            </button>
            <button type="button" className="btn-danger" onClick={kill}>
              Eliminar cuenta
            </button>
          </div>
        </form>

        {msg && (
          <p id="profile-message" className="profile-message" role="status">
            {msg}
          </p>
        )}
      </div>
    </section>
  );
}
