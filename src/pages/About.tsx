import React from "react";

/**
 * About Component
 * 
 * A React component that displays comprehensive information about Lumina platform.
 * Features a modern dark-themed layout with company branding and feature highlights.
 * 
 * Includes WCAG robustness principle by ensuring semantic HTML, ARIA roles, and assistive technology compatibility.
 * 
 * @component
 * @returns A complete about page with company information, features, and mission
 */
export default function About() {
  return (
    <main className="about-page" role="main">
      <div className="about-container">

        {/* Header Section */}
        <header className="about-header" role="banner">
          <h1>Sobre nosotros</h1>
        </header>

        {/* Logo and Tagline Section */}
        <section className="about-logo-section" aria-labelledby="lumina-info">
          <div className="about-logo">
            <img
              src="/Lumina.png"
              alt="Logotipo de Lumina, plataforma de streaming"
              className="about-logo-image"
            />
          </div>
          <p id="lumina-info" className="about-tagline">
            Tu compañero perfecto para disfrutar de las mejores películas del momento
          </p>
        </section>

        {/* What is Lumina Section */}
        <section className="about-section" aria-labelledby="que-es">
          <h2 id="que-es">¿Qué es Lumina?</h2>
          <p>
            Lumina es una plataforma de streaming moderna diseñada para ofrecerte la mejor experiencia cinematográfica. 
            Con una interfaz intuitiva y un catálogo extenso, te permitimos disfrutar de las mejores películas desde la comodidad de tu hogar.
          </p>
        </section>

        {/* Features Section */}
        <section className="about-features" aria-labelledby="caracteristicas">
          <h2 id="caracteristicas">Características principales</h2>
          <div className="features-grid" role="list">

            <article className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">🎬</div>
              <h3>Catálogo Extenso</h3>
              <p>Accede a miles de películas de todos los géneros, desde clásicos hasta los últimos estrenos.</p>
            </article>

            <article className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">⭐</div>
              <h3>Recomendaciones</h3>
              <p>Descubre nuevas películas basadas en tus gustos y preferencias con nuestro algoritmo de recomendación.</p>
            </article>

            <article className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">💻</div>
              <h3>Multiplataforma</h3>
              <p>Disfruta de tus películas favoritas en cualquier dispositivo: móvil, tablet, computadora o smart TV.</p>
            </article>

            {/* Robust Feature */}
            <article className="feature-card" role="listitem">
              <div className="feature-icon" aria-hidden="true">🧩</div>
              <h3>Robusto</h3>
              <p>
                Construido bajo los principios de accesibilidad del W3C (WCAG 2.1), 
                garantizando compatibilidad con lectores de pantalla, navegadores modernos 
                y dispositivos de asistencia. Su estructura semántica y uso de roles ARIA 
                aseguran una experiencia consistente y accesible para todos los usuarios.
              </p>
            </article>

          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section" aria-labelledby="mision">
          <h2 id="mision">Nuestra misión</h2>
          <p>
            Creemos que el entretenimiento de calidad debe ser accesible para todos. 
            Lumina está diseñado para ofrecer la mejor experiencia cinematográfica, con contenido de alta calidad y una plataforma fácil de usar que te permite sumergirte en historias extraordinarias.
          </p>
        </section>

        {/* Version Section */}
        <section className="about-version" aria-labelledby="version">
          <h2 id="version">Versión actual</h2>
          <div className="version-info">
            <span className="version-badge">v1.0.0</span>
            <span className="version-status">Estable</span>
          </div>
          <p>
            Construido con React + Vite + TypeScript + SASS. Cumple con las pautas WCAG (perceptible, operable, comprensible y robusto), 
            garantizando accesibilidad y compatibilidad con diversas tecnologías de asistencia.
          </p>
        </section>

        {/* Credits Section */}
        <footer className="about-credits" role="contentinfo">
          <h2>Desarrollado por</h2>
          <div className="credits-info">
            <span className="team-name">404 Crew</span>
            <p className="team-description">
              Equipo de desarrollo dedicado a crear experiencias web excepcionales
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
