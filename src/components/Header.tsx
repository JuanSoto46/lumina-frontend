/* src/components/Header.tsx */
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

type Props = { authed: boolean; onLogout: () => void };

export default function Header({ authed, onLogout }: Props) {
  const [open, setOpen] = useState(false);

  const Item = ({ to, children }: React.PropsWithChildren<{ to: string }>) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded navlink ${isActive ? "is-active" : ""}`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="nav" role="banner">
      <a href="#main" className="skip-link">Saltar al contenido</a>

      <nav className="container nav-inner" aria-label="Principal">
        <Link to="/" className="nav-logo">
          <img src="/play-barra.png" alt="Lumina" className="nav-logo-image" />
          <span>Lumina</span>
        </Link>

        {/* Menú visible en desktop */}
        <div className="nav-items hidden-md" role="menubar">
          <ul>
            {!authed && <li role="none"><Item to="/">Inicio</Item></li>}
            <li role="none"><Item to="/about">Sobre nosotros</Item></li>
            <li role="none"><Item to="/user-manual">Manual de usuario</Item></li>
            {authed && <li role="none"><Item to="/pexels">Videos</Item></li>}
            {authed && <li role="none"><Item to="/favorites">Favoritos</Item></li>}
            {!authed && (
              <>
                <li role="none"><Item to="/login">Inicia sesión</Item></li>
                <li role="none"><Item to="/signup">Crea una cuenta</Item></li>
              </>
            )}
            {authed && (
              <>
                <li role="none"><Item to="/profile">Perfil</Item></li>
                <li role="none">
                  <button className="linklike" onClick={onLogout}>Cerrar sesión</button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Hamburguesa SIEMPRE, también en desktop */}
        <button
          className="hamb-btn show-md"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
          type="button"
        >
          {/* Icono de 3 líneas, sin relleno negro */}
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

      </nav>

      {open && (
        <div id="mobile-menu" className="mobile-menu show-md" role="dialog" aria-modal="true" aria-label="Menú">
          <ul onClick={() => setOpen(false)}>
            {!authed && <li><Item to="/">Inicio</Item></li>}
            <li><Item to="/about">Sobre nosotros</Item></li>
            <li><Item to="/user-manual">Manual de usuario</Item></li>
            {authed && <li><Item to="/pexels">Videos</Item></li>}
            {authed && <li><Item to="/favorites">Favoritos</Item></li>}
            {!authed && (
              <>
                <li><Item to="/login">Inicia sesión</Item></li>
                <li><Item to="/signup">Crea una cuenta</Item></li>
              </>
            )}
            {authed && (
              <>
                <li><Item to="/profile">Perfil</Item></li>
                <li><button className="linklike" onClick={onLogout}>Cerrar sesión</button></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
