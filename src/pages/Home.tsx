/**
 * The Home component in this TypeScript React code displays a welcome message and information about a
 * movie platform prototype.
 * @returns A section element containing a heading "Welcome to Lumina" and a paragraph "Streamlined
 * movie platform prototype. Sprint 1 focuses on user management."
 */
import React from "react";

export default function Home() {
  return (
    <section
      role="region"
      aria-labelledby="home-title"
      lang="en"
    >
      <h2 id="home-title">Welcome to Lumina</h2>
      <p>
        Streamlined movie platform prototype. Sprint 1 focuses on user management.
      </p>
    </section>
  );
}
