/* The code you provided is importing various modules and components needed for a React application.
Here is a breakdown of each import statement: */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Pexels from "./pages/Pexels";
import Footer from "./components/Footer";
import Header from "./components/Header";                
import ChangePassword from "./pages/ChangePassword";
import { api } from "./services/api";

/**
 * The `App` function in this TypeScript React component manages authentication state, routing, and
 * rendering different components based on the user's authentication status.
 */
function AppContent() {
  /* The line `const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));` in the
  `App` function is initializing a state variable `authed` using the `useState` hook in React. */
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));
  const location = useLocation();

  /* The `useEffect` hook in the provided code snippet is used to set up a listener for changes in the
  browser's `localStorage` object. Here's a breakdown of what it's doing: */
  useEffect(() => {
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Initialize navbar scroll behavior */
  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navbar = document.querySelector('.nav');
      
      if (!navbar) return;
      
      // Check if we're on a login-type page
      const isLoginPage = location.pathname.includes('/login') || 
                         location.pathname.includes('/signup') || 
                         location.pathname.includes('/forgot') || 
                         location.pathname.includes('/reset');
      
      if (isLoginPage) return; // Don't hide navbar on login pages
      
      if (scrollTop > lastScrollTop && scrollTop > 1) {
        // Scrolling down - hide navbar immediately after any scroll
        navbar.classList.add('nav-hidden');
      } else if (scrollTop < lastScrollTop) {
        // Scrolling up - show navbar
        navbar.classList.remove('nav-hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const navbar = document.querySelector('.nav');
      if (navbar) {
        navbar.classList.remove('nav-hidden');
      }
    };
  }, [location.pathname]);

  /**
   * The `logout` function logs out the user by calling the `api.logout()` function and setting the
   * `authed` state to `false`.
   */
  function logout() {
    api.logout();
    setAuthed(false);
  }

  return (
    <>
      <Header authed={authed} onLogout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {authed && <Route path="/pexels" element={<Pexels />} />}
          <Route path="/login" element={<Login onAuth={() => setAuthed(true)} />} />
          <Route path="/signup" element={<Signup />} />
          {authed && <Route path="/profile" element={<Profile />} />}
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
          {authed && <Route path="/settings/password" element={<ChangePassword />} />}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
