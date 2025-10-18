/* The code you provided is importing various modules and components needed for a React application.
Here is a breakdown of each import statement: */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Footer from "./components/Footer";
import { api } from "./services/api";

/**
 * The `App` function in this TypeScript React component manages authentication state, routing, and
 * rendering different components based on the user's authentication status.
 */
export default function App() {
  /* The line `const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));` in the
  `App` function is initializing a state variable `authed` using the `useState` hook in React. */
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));

  /* The `useEffect` hook in the provided code snippet is used to set up a listener for changes in the
  browser's `localStorage` object. Here's a breakdown of what it's doing: */
  useEffect(() => {
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /**
   * The `logout` function logs out the user by calling the `api.logout()` function and setting the
   * `authed` state to `false`.
   */
  function logout() {
    api.logout();
    setAuthed(false);
  }

  return (
    <BrowserRouter>
      <header className="nav">
        <nav className="container">
          <div className="nav-logo">
            <img src="/play-barra.png" alt="Lumina" className="nav-logo-image" />
            <span>Lumina</span>
          </div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            {!authed && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
              </>
            )}
            {authed && (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="#" onClick={logout}>Logout</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onAuth={() => setAuthed(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
