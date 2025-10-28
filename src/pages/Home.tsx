/**
 * The Home component displays an enhanced landing page with hero section,
 * features showcase, and call-to-action elements for the Lumina platform.
 * @returns A complete home page with modern design and interactive elements
 */
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page" role="main" aria-labelledby="home-title">
      
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="hero-text">
            <h1 id="hero-title" className="hero-title">
              Bienvenido a <span className="brand-highlight">Lumina</span>
            </h1>
            <p className="hero-subtitle">
              Descubre un mundo de entretenimiento sin límites. La plataforma de streaming 
              que transforma tu manera de ver videos.
            </p>
            <div className="hero-features">
              <div className="feature-highlight">
                <span className="feature-icon">🎬</span>
                <span>Videos de alta calidad</span>
              </div>
              <div className="feature-highlight">
                <span className="feature-icon">🔍</span>
                <span>Búsqueda inteligente</span>
              </div>
              <div className="feature-highlight">
                <span className="feature-icon">❤️</span>
                <span>Sistema de favoritos</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary btn-large">
                Comenzar Ahora
              </Link>
              <Link to="/about" className="btn-secondary btn-large">
                Conoce Más
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img src="/Lumina.png" alt="Lumina Platform" className="hero-logo" />
              <div className="floating-elements">
                <div className="floating-card floating-card-1">
                  <div className="card-icon">🎥</div>
                  <span>Streaming</span>
                </div>
                <div className="floating-card floating-card-2">
                  <div className="card-icon">⭐</div>
                  <span>Calidad HD</span>
                </div>
                <div className="floating-card floating-card-3">
                  <div className="card-icon">📱</div>
                  <span>Multi-dispositivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="container">
          <h2 id="features-title" className="section-title">
            ¿Por qué elegir Lumina?
          </h2>
          <div className="features-grid">
            
            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">🎬</span>
              </div>
              <h3>Biblioteca Extensa</h3>
              <p>
                Accede a miles de videos de alta calidad, desde contenido popular 
                hasta descubrimientos únicos que te sorprenderán.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">🔍</span>
              </div>
              <h3>Búsqueda Inteligente</h3>
              <p>
                Encuentra exactamente lo que buscas con nuestro sistema de búsqueda 
                avanzado y filtros por categorías.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">❤️</span>
              </div>
              <h3>Favoritos Personalizados</h3>
              <p>
                Guarda tus videos favoritos y crea tu propia colección 
                personalizada para acceso rápido.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">📱</span>
              </div>
              <h3>Acceso Universal</h3>
              <p>
                Disfruta de Lumina en cualquier dispositivo: móvil, tablet 
                o computadora, siempre con la mejor calidad.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">⚡</span>
              </div>
              <h3>Velocidad Optimizada</h3>
              <p>
                Carga ultra-rápida y streaming sin interrupciones, 
                optimizado para tu conexión a internet.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card-icon">
                <span className="icon-large">🛡️</span>
              </div>
              <h3>Seguro y Confiable</h3>
              <p>
                Tus datos están protegidos con los más altos estándares 
                de seguridad y privacidad.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="sr-only">Estadísticas de Lumina</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Videos Disponibles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">HD</div>
              <div className="stat-label">Calidad Premium</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Acceso Ilimitado</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gratuito</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-content">
            <h2 id="cta-title" className="cta-title">
              ¿Listo para comenzar tu experiencia Lumina?
            </h2>
            <p className="cta-subtitle">
              Únete a miles de usuarios que ya disfrutan del mejor contenido de video. 
              Es gratis y solo toma unos minutos.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary btn-large">
                Crear Cuenta Gratis
              </Link>
              <Link to="/user-manual" className="btn-outline btn-large">
                Ver Manual de Usuario
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
