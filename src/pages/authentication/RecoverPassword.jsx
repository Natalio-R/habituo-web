import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../hooks/firebase";
import Button from "../../components/buttons/Button";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    setMessage("");
    setError("");

    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Se ha enviado un enlace de recuperación a tu correo. Por favor, revisa tu bandeja de entrada."
      );
    } catch (err) {
      console.error("Error al enviar el correo de recuperación:", err);
      if (err.code === "auth/user-not-found") {
        setError("No se encontró una cuenta con este correo.");
      } else {
        setError("Ocurrió un error inesperado. Inténtalo más tarde.");
      }
    }
  };

  return (
    <main id="recover-password" className="container">
      <div className="content__title">
        <h1>Recupera tu contraseña</h1>
        <p>
          Introduce tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>
      <div className="input__group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="nombre@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <span className="input__error">{error}</span>}
      </div>
      <Button
        text="Enviar enlace"
        type="button"
        styleType="btn-primary"
        onClick={handlePasswordReset}
      />
      <p>{message && <span className="success-message">{message}</span>}</p>
      <p>
        ¿Ya tienes cuenta? <Link to="/login"> Inicia sesión</Link>
      </p>
    </main>
  );
};

export default RecoverPassword;
