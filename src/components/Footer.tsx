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
          <li><Link to="/login">Inicia sesión</Link></li>
          <li><Link to="/signup">Crea una cuenta</Link></li>
          <li><Link to="/forgot">Recuperar contraseña</Link></li>
          {/* Cambiar contraseña solo para autenticados, se muestra en el menú del header */}
        </ul>
        <p>© 2025 Lumina. Contraste accesible, enfoque visible, formularios etiquetados.</p>
      </div>
    </footer>
  );
}
