import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/Lumina.png" alt="Lumina" className="sidebar-logo-image" />
            <span className="sidebar-brand">Lumina</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Navegación</h3>
            <NavLink 
              to="/pexels" 
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">🎬</span>
              <span className="sidebar-text">Videos</span>
            </NavLink>
            <NavLink 
              to="/profile" 
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">👤</span>
              <span className="sidebar-text">Mi cuenta</span>
            </NavLink>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Favoritos</h3>
            <NavLink 
              to="/favorites" 
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">❤️</span>
              <span className="sidebar-text">Mis favoritos</span>
            </NavLink>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Información</h3>
            <NavLink 
              to="/about" 
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">ℹ️</span>
              <span className="sidebar-text">Sobre nosotros</span>
            </NavLink>
            <NavLink 
              to="/user-manual" 
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">📖</span>
              <span className="sidebar-text">Manual de usuario</span>
            </NavLink>
          </div>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-text">Cerrar sesión</span>
        </button>
      </div>
    </>
  );
}