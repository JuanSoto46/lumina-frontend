import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        <strong>Mapa de sitio:</strong>
        <ul className="footer-sitemap">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Sobre nosotros</Link></li>
          <li><Link to="/user-manual">Manual de usuario</Link></li>
          <li><Link to="/login">Inicia sesión</Link></li>
          <li><Link to="/signup">Crea una cuenta</Link></li>
          <li><Link to="/forgot">Recuperar contraseña</Link></li>
        </ul>
        <p>© 2025 Lumina. Accesibilidad: contraste AA, enfoque visible, navegación por teclado.</p>
      </div>
    </footer>
  );
}
