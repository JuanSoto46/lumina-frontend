// src/components/PasswordField.tsx
import React, { useId, useState } from "react";

type Props = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;           // ej. "login-input"
  autoComplete?: string;
};

export default function PasswordField({
  id,
  name = "password",
  label = "Contraseña",
  placeholder = "Contraseña",
  value,
  onChange,
  required,
  className = "",
  autoComplete = "current-password",
}: Props) {
  const uid = useId();
  const inputId = id || `pwd-${uid}`;
  const [show, setShow] = useState(false);

  return (
    <div className="password-field">
      <label htmlFor={inputId} className="password-label">{label}</label>

      <div className="password-wrap">
        <input
          id={inputId}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`login-input ${className}`.trim()}
          aria-describedby={`${inputId}-hint`}
        />

        <button
  type="button"
  className={`eye-btn ${show ? "is-on" : ""}`}
  aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
  onClick={() => setShow(s => !s)}
>
  {/* OJO ABIERTO (outline) */}
  <svg className="icon-eye open" viewBox="0 0 24 24" aria-hidden="true">
    {/* contorno del ojo */}
    <path
      d="M2 12c2.5-4.5 6.8-7 10-7s7.5 2.5 10 7c-2.5 4.5-6.8 7-10 7s-7.5-2.5-10-7Z"
    />
    {/* iris (anillo) */}
    <circle cx="12" cy="12" r="3.8" className="iris" />
    {/* pupila (punto) */}
    <circle cx="12" cy="12" r="1.6" className="pupil" />
  </svg>

  {/* OJO TACHADO */}
  <svg className="icon-eye off" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 12c2.5-4.5 6.8-7 10-7s7.5 2.5 10 7c-2.5 4.5-6.8 7-10 7s-7.5-2.5-10-7Z"/>
    <circle cx="12" cy="12" r="3.8" className="iris" />
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
</button>

      </div>

      <span id={`${inputId}-hint`} className="sr-only">
        Botón con icono de ojo para alternar visibilidad.
      </span>
    </div>
  );
}
