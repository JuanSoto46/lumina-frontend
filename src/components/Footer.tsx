import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <strong>Mapa de sitio:</strong>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Sobre nosotros</Link></li>
          <li><Link to="/user-manual">Manual de usuario</Link></li>
          <li><Link to="/pexels">Videos Populares</Link></li>
          <li><Link to="/favorites">Mis Favoritos</Link></li>
          <li><Link to="/profile">Mi Perfil</Link></li>
          <li><Link to="/login">Inicia sesión</Link></li>
          <li><Link to="/signup">Crea una cuenta</Link></li>
          <li><Link to="/forgot">Recuperar contraseña</Link></li>
          <li><Link to="/reset">Restablecer contraseña</Link></li>
          <li><Link to="/settings/password">Cambiar contraseña</Link></li>
        </ul>
        <p>© 2025 Lumina. Plataforma de videos de alta calidad con accesibilidad completa.</p>
      </div>
    </footer>
  );
}
