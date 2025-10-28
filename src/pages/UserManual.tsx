/**
 * UserManual Component
 * 
 * A comprehensive user manual for the Lumina platform, providing step-by-step
 * instructions for all features and functionality. This component is accessible
 * to all users regardless of authentication status.
 * 
 * @component
 * @returns Complete user manual with navigation, feature explanations, and troubleshooting
 */
import React, { useState } from "react";

export default function UserManual() {
  const [activeSection, setActiveSection] = useState("getting-started");

  /**
   * Navigation items for the user manual sections
   */
  const sections = [
    { id: "getting-started", title: "Primeros Pasos", icon: "🚀" },
    { id: "account-management", title: "Gestión de Cuenta", icon: "👤" },
    { id: "video-browsing", title: "Navegación de Videos", icon: "🎬" },
    { id: "favorites", title: "Gestión de Favoritos", icon: "❤️" },
    { id: "search-features", title: "Funciones de Búsqueda", icon: "🔍" },
    { id: "troubleshooting", title: "Solución de Problemas", icon: "🔧" },
    { id: "accessibility", title: "Características de Accesibilidad", icon: "♿" },
    { id: "faq", title: "Preguntas Frecuentes", icon: "❓" }
  ];

  /**
   * Handles section navigation
   * @param sectionId - The ID of the section to navigate to
   */
  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="user-manual" role="main" aria-labelledby="manual-title">
      <div className="manual-container">
        
        {/* Header Section */}
        <header className="manual-header" role="banner">
          <h1 id="manual-title">Manual de Usuario de Lumina</h1>
          <p className="manual-subtitle">
            Guía completa para usar la plataforma de videos Lumina
          </p>
        </header>

        {/* Navigation Sidebar */}
        <nav className="manual-navigation" role="navigation" aria-label="Manual sections">
          <h2 className="nav-title">Tabla de Contenidos</h2>
          <ul className="nav-list">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => navigateToSection(section.id)}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{section.icon}</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="manual-content" role="main">

          {/* Getting Started Section */}
          <section id="getting-started" className="manual-section" aria-labelledby="getting-started-title">
            <h2 id="getting-started-title">🚀 Primeros Pasos</h2>
            
            <article className="content-block">
              <h3>Bienvenido a Lumina</h3>
              <p>
                Lumina es una plataforma moderna de streaming de videos diseñada para brindarte 
                la mejor experiencia cinematográfica. Ya sea que busques los últimos estrenos 
                o películas clásicas, nuestra interfaz intuitiva hace que sea fácil descubrir y disfrutar contenido.
              </p>
            </article>

            <article className="content-block">
              <h3>Requisitos del Sistema</h3>
              <ul>
                <li><strong>Navegador:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
                <li><strong>Internet:</strong> Conexión de banda ancha estable (mínimo 5 Mbps)</li>
                <li><strong>Dispositivo:</strong> Computadora de escritorio, tablet o dispositivo móvil</li>
                <li><strong>JavaScript:</strong> Debe estar habilitado</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Primeros Pasos</h3>
              <ol>
                <li>Visita la página principal de Lumina</li>
                <li>Crea una cuenta o inicia sesión en una existente</li>
                <li>Explora la biblioteca de videos</li>
                <li>Comienza a ver tu contenido favorito</li>
              </ol>
            </article>
          </section>

          {/* Account Management Section */}
          <section id="account-management" className="manual-section" aria-labelledby="account-title">
            <h2 id="account-title">👤 Gestión de Cuenta</h2>
            
            <article className="content-block">
              <h3>Crear una Cuenta</h3>
              <ol>
                <li>Haz clic en "Crea una cuenta" desde la página principal</li>
                <li>Completa el formulario de registro con:
                  <ul>
                    <li>Nombre</li>
                    <li>Apellido</li>
                    <li>Edad (se requiere 18+ años)</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Contraseña</li>
                    <li>Confirmación de contraseña</li>
                  </ul>
                </li>
                <li>Haz clic en "Crear cuenta" para completar el registro</li>
                <li>Recibirás un mensaje de confirmación</li>
              </ol>
            </article>

            <article className="content-block">
              <h3>Iniciar Sesión</h3>
              <ol>
                <li>Haz clic en "Inicia sesión" en el menú de navegación</li>
                <li>Ingresa tu correo electrónico y contraseña</li>
                <li>Haz clic en "INGRESAR" para acceder a tu cuenta</li>
                <li>Serás redirigido a la biblioteca de videos</li>
              </ol>
            </article>

            <article className="content-block">
              <h3>Gestión del Perfil</h3>
              <p>Una vez que hayas iniciado sesión, puedes gestionar tu perfil:</p>
              <ul>
                <li><strong>Actualizar Información:</strong> Cambia tu nombre, edad o correo electrónico</li>
                <li><strong>Cambiar Contraseña:</strong> Actualiza la seguridad de tu cuenta</li>
                <li><strong>Cerrar Sesión:</strong> Sal de tu cuenta de forma segura</li>
                <li><strong>Eliminar Cuenta:</strong> Elimina permanentemente tu cuenta</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Recuperación de Contraseña</h3>
              <ol>
                <li>Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión</li>
                <li>Ingresa tu dirección de correo electrónico</li>
                <li>Revisa tu correo electrónico para encontrar el enlace de recuperación</li>
                <li>Sigue el enlace para restablecer tu contraseña</li>
                <li>Crea una nueva contraseña y confírmala</li>
              </ol>
            </article>
          </section>

          {/* Video Browsing Section */}
          <section id="video-browsing" className="manual-section" aria-labelledby="video-title">
            <h2 id="video-title">🎬 Navegación de Videos</h2>
            
            <article className="content-block">
              <h3>Explorando la Biblioteca de Videos</h3>
              <p>
                La página de Videos es tu puerta de entrada para descubrir contenido. Aquí encontrarás:
              </p>
              <ul>
                <li><strong>Cuadrícula de Videos:</strong> Navega videos en un diseño organizado</li>
                <li><strong>Barra de Búsqueda:</strong> Encuentra contenido específico rápidamente</li>
                <li><strong>Vista Previa de Videos:</strong> Pasa el cursor sobre los videos para ver previsualizaciones rápidas</li>
                <li><strong>Detalles del Video:</strong> Haz clic para obtener más información</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Interacción con Videos</h3>
              <ul>
                <li><strong>Clic para Ver:</strong> Haz clic en cualquier video para abrirlo en vista completa</li>
                <li><strong>Información del Video:</strong> Ve el título, duración y detalles de calidad</li>
                <li><strong>Cerrar Video:</strong> Usa el botón X o presiona Escape para cerrar</li>
                <li><strong>Navegación por Teclado:</strong> Usa las teclas Tab y Enter para accesibilidad</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Opciones de Calidad de Video</h3>
              <p>Los videos están disponibles en múltiples niveles de calidad:</p>
              <ul>
                <li><strong>HD (1080p):</strong> Alta definición para la mejor experiencia</li>
                <li><strong>SD (720p):</strong> Definición estándar para conexiones más lentas</li>
                <li><strong>Móvil:</strong> Optimizado para dispositivos móviles</li>
              </ul>
            </article>
          </section>

          {/* Favorites Section */}
          <section id="favorites" className="manual-section" aria-labelledby="favorites-title">
            <h2 id="favorites-title">❤️ Gestión de Favoritos</h2>
            
            <article className="content-block">
              <h3>Añadir Favoritos</h3>
              <p>
                Guarda videos que te encantan para acceder fácilmente después:
              </p>
              <ol>
                <li>Navega a cualquier video en la biblioteca</li>
                <li>Busca el icono de corazón en el video</li>
                <li>Haz clic en el corazón para añadir a favoritos</li>
                <li>El corazón se llenará para confirmar que está guardado</li>
              </ol>
            </article>

            <article className="content-block">
              <h3>Ver tus Favoritos</h3>
              <ol>
                <li>Haz clic en "Favoritos" en el menú de navegación</li>
                <li>Navega por tus videos guardados</li>
                <li>Haz clic en cualquier video para verlo</li>
                <li>Usa el botón de eliminar para quitar de favoritos</li>
              </ol>
            </article>

            <article className="content-block">
              <h3>Gestionar tu Colección</h3>
              <ul>
                <li><strong>Eliminar Elementos:</strong> Haz clic en el icono de papelera para eliminar videos</li>
                <li><strong>Ver Detalles:</strong> Ve cuándo añadiste cada video</li>
                <li><strong>Acceso Rápido:</strong> Reproduce videos directamente desde la página de favoritos</li>
              </ul>
            </article>
          </section>

          {/* Search Features Section */}
          <section id="search-features" className="manual-section" aria-labelledby="search-title">
            <h2 id="search-title">🔍 Funciones de Búsqueda</h2>
            
            <article className="content-block">
              <h3>Búsqueda Básica</h3>
              <ol>
                <li>Navega a la página de Videos</li>
                <li>Usa la barra de búsqueda en la parte superior</li>
                <li>Escribe palabras clave relacionadas con lo que buscas</li>
                <li>Presiona Enter o haz clic en el botón de búsqueda</li>
                <li>Navega por los resultados filtrados</li>
              </ol>
            </article>

            <article className="content-block">
              <h3>Consejos de Búsqueda</h3>
              <ul>
                <li><strong>Palabras Clave:</strong> Usa términos específicos para mejores resultados</li>
                <li><strong>Géneros:</strong> Busca por género (acción, comedia, drama, etc.)</li>
                <li><strong>Limpiar Búsqueda:</strong> Limpia el campo de búsqueda para ver todos los videos</li>
                <li><strong>Sin Resultados:</strong> Intenta con diferentes palabras clave si no aparecen resultados</li>
              </ul>
            </article>
          </section>

          {/* Troubleshooting Section */}
          <section id="troubleshooting" className="manual-section" aria-labelledby="troubleshooting-title">
            <h2 id="troubleshooting-title">🔧 Solución de Problemas</h2>
            
            <article className="content-block">
              <h3>Problemas Comunes y Soluciones</h3>
              
              <div className="trouble-item">
                <h4>Los Videos No Cargan</h4>
                <ul>
                  <li>Verifica tu conexión a internet</li>
                  <li>Actualiza la página</li>
                  <li>Limpia la caché de tu navegador</li>
                  <li>Prueba con un navegador diferente</li>
                </ul>
              </div>

              <div className="trouble-item">
                <h4>No Puedo Iniciar Sesión</h4>
                <ul>
                  <li>Verifica tu correo electrónico y contraseña</li>
                  <li>Usa la función "¿Olvidaste tu contraseña?"</li>
                  <li>Verifica errores tipográficos en tu correo</li>
                  <li>Asegúrate de que tu cuenta existe</li>
                </ul>
              </div>

              <div className="trouble-item">
                <h4>La Búsqueda No Funciona</h4>
                <ul>
                  <li>Prueba con diferentes términos de búsqueda</li>
                  <li>Limpia el campo de búsqueda e intenta de nuevo</li>
                  <li>Actualiza la página</li>
                  <li>Verifica tu ortografía</li>
                </ul>
              </div>

              <div className="trouble-item">
                <h4>La Página Carga Lentamente</h4>
                <ul>
                  <li>Verifica la velocidad de tu internet</li>
                  <li>Cierra otras pestañas del navegador</li>
                  <li>Reinicia tu navegador</li>
                  <li>Limpia la caché y cookies del navegador</li>
                </ul>
              </div>
            </article>
          </section>

          {/* Accessibility Section */}
          <section id="accessibility" className="manual-section" aria-labelledby="accessibility-title">
            <h2 id="accessibility-title">♿ Características de Accesibilidad</h2>
            
            <article className="content-block">
              <h3>Navegación por Teclado</h3>
              <ul>
                <li><strong>Tab:</strong> Avanzar a través de elementos interactivos</li>
                <li><strong>Shift + Tab:</strong> Retroceder a través de elementos</li>
                <li><strong>Enter/Espacio:</strong> Activar botones y enlaces</li>
                <li><strong>Escape:</strong> Cerrar modales y menús</li>
                <li><strong>Teclas de Flecha:</strong> Navegar dentro de menús</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Soporte para Lectores de Pantalla</h3>
              <p>
                Lumina es completamente compatible con lectores de pantalla incluyendo:
              </p>
              <ul>
                <li>NVDA (Windows)</li>
                <li>JAWS (Windows)</li>
                <li>VoiceOver (Mac/iOS)</li>
                <li>TalkBack (Android)</li>
              </ul>
            </article>

            <article className="content-block">
              <h3>Accesibilidad Visual</h3>
              <ul>
                <li><strong>Alto Contraste:</strong> El texto cumple con los estándares de contraste de accesibilidad</li>
                <li><strong>Indicadores de Foco:</strong> Foco visual claro para usuarios de teclado</li>
                <li><strong>Diseño Responsivo:</strong> Funciona en todos los tamaños de pantalla</li>
                <li><strong>Escalado de Texto:</strong> El contenido se escala hasta 200% sin pérdida de funcionalidad</li>
              </ul>
            </article>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="manual-section" aria-labelledby="faq-title">
            <h2 id="faq-title">❓ Preguntas Frecuentes</h2>
            
            <article className="content-block">
              <div className="faq-item">
                <h3>¿Es gratis usar Lumina?</h3>
                <p>
                  Sí, Lumina es gratuito. Simplemente crea una cuenta y comienza a navegar 
                  nuestra biblioteca de videos inmediatamente.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Necesito descargar algo?</h3>
                <p>
                  No se requieren descargas. Lumina funciona completamente en tu navegador web. 
                  Solo visita nuestro sitio web y comienza a ver.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Puedo usar Lumina en dispositivos móviles?</h3>
                <p>
                  ¡Absolutamente! Lumina es completamente responsivo y funciona genial en teléfonos 
                  inteligentes, tablets y computadoras de escritorio.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Cómo reporto un problema?</h3>
                <p>
                  Si encuentras algún problema, por favor usa la guía de solución de problemas de arriba. 
                  Para soporte adicional, contacta a nuestro equipo de desarrollo.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Puedo compartir mis favoritos con otros?</h3>
                <p>
                  Actualmente, los favoritos son privados para tu cuenta. Esta función puede ser 
                  añadida en futuras actualizaciones.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Qué navegadores son compatibles?</h3>
                <p>
                  Lumina es compatible con todos los navegadores modernos incluyendo Chrome, Firefox, Safari, 
                  y Edge. Asegúrate de usar una versión actualizada para la mejor experiencia.
                </p>
              </div>
            </article>
          </section>

        </div>

        {/* Footer */}
        <footer className="manual-footer" role="contentinfo">
          <div className="footer-content">
            <p>
              <strong>¿Necesitas más ayuda?</strong> Este manual cubre todas las características actuales de Lumina. 
              Para soporte técnico o sugerencias, por favor contacta a nuestro equipo de desarrollo.
            </p>
            <p className="version-info">
              Versión del Manual: 1.0 | Última Actualización: Octubre 2025 | Plataforma Lumina v1.0.0
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}