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
        `px-3 py-2 rounded hover:bg-gray-100 ${
          isActive ? "text-indigo-400 font-semibold" : "text-gray-200"
        }`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="nav">
      <nav className="container nav-inner">
        <Link to="/" className="nav-logo">
          <img src="/play-barra.png" alt="Lumina" className="nav-logo-image" />
          <span>Lumina</span>
        </Link>

        {/* Desktop */}
        <div className="nav-items hidden-md">
          <ul>
            {!authed && <li><Item to="/">Inicio</Item></li>}
            <li><Item to="/about">Sobre nosotros</Item></li>
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

        {/* Mobile button */}
        <button className="hamb-btn show-md" aria-label="Abrir menú" onClick={() => setOpen(v => !v)}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu show-md">
          <ul onClick={() => setOpen(false)}>
            {!authed && <li><Item to="/">Inicio</Item></li>}
            <li><Item to="/about">Sobre nosotros</Item></li>
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
