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

export default function App() {
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));

  useEffect(() => {
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    api.logout();
    setAuthed(false);
  }

  return (
    <BrowserRouter>
      <header className="nav">
        <nav className="container nav-row">
          <div className="brand">
            <img src="/logo.png" alt="Lumina logo" width={28} height={28} />
            <h1>Lumina</h1>
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
                <li><button className="linklike" onClick={logout}>Logout</button></li>
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
