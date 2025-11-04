/* src/components/Header.tsx */
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

type Props = { 
  authed: boolean; 
  onLogout: () => void;
  onToggleSidebar?: () => void;
  showSearchInHeader?: boolean;
};

export default function Header({ authed, onLogout, onToggleSidebar, showSearchInHeader }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

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
        {/* Botón del sidebar SOLO con sesión */}
        {authed && onToggleSidebar && (
          <button 
            className="hamburger-btn" 
            onClick={onToggleSidebar}
            aria-label="Abrir menú lateral"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="Inicio" title="Lumina">
  <img src="/play-barra.png" alt="" aria-hidden="true" className="nav-logo-image" />
  <span className="nav-logo-text">Lumina</span>
</Link>


        {showSearchInHeader && (
  <form
    className="nav-search"
    onSubmit={(e) => {
      e.preventDefault();
      const term = q.trim();
      if (!term) return;
      window.dispatchEvent(new CustomEvent('pexels:search', { detail: term }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    role="search"
    aria-label="Buscar videos"
  >
    <input
      name="q"
      type="search"
      placeholder="Buscar..."
      className="nav-search-input"
      aria-label="Buscar videos"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
    {q && (
      <button
        type="button"
        className="nav-search-clear"
        aria-label="Borrar búsqueda"
        onClick={() => {
          setQ("");
          window.dispatchEvent(new Event('pexels:clear'));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        ×
      </button>
    )}
  </form>
)}
        {/* MENÚ PÚBLICO: visible siempre, sin hamburguesa */}
        {!authed && (
          <div className="nav-right nav-right--public">
            <ul>
              <li><Item to="/">Inicio</Item></li>
              <li><Item to="/login">Inicia sesión</Item></li>
              <li><Item to="/signup">Crea una cuenta</Item></li>
            </ul>
          </div>
        )}

        {/* MENÚ AUTENTICADO: a la derecha, colapsable en móvil */}
        {authed && (
          <>
            <div className={`nav-right nav-right--authed ${open ? "open" : ""}`}>
              <ul>
                <li><Item to="/">Inicio</Item></li>
                <li><Item to="/Pexels">Videos</Item></li>
                <li><Item to="/about">Sobre nosotros</Item></li>
                <li><Item to="/user-manual">Manual de usuario</Item></li>
                <li>
                  <button
                    className="px-3 py-2 rounded text-gray-200 hover:bg-gray-100"
                    onClick={onLogout}
                  >
                    Salir
                  </button>
                </li>
              </ul>
            </div>

            {/* Hamburguesa SOLO autenticado, para abrir/cerrar el menú en móvil */}
            <button
              className="hamb-btn"
              aria-label="Abrir menú"
              onClick={() => setOpen(v => !v)}
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
