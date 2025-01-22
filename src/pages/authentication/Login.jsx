import React, { useState } from "react";
import { Link } from "react-router-dom";
import gLogo from "../../assets/images/icons/g-icon.webp";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../hooks/firebase";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Por favor, introduce un correo válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña no puede estar vacía.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/user-not-found") {
        setErrors((prev) => ({
          ...prev,
          email: "No se encontró una cuenta con este correo.",
        }));
      } else if (error.code === "auth/wrong-password") {
        setErrors((prev) => ({
          ...prev,
          password: "La contraseña es incorrecta.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Ocurrió un error inesperado. Inténtalo más tarde.",
        }));
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Usuario:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <main id="login" className="container">
      <h1>Conecta tu cuenta</h1>
      <div className="input__group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="nombre@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="input__error">{errors.email}</span>}
      </div>
      <div className="input__group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>
          ¿Olvidaste tu contraseña?{" "}
          <Link
            to="/recover-password"
            onClick={(e) => {
              e.preventDefault();
              navigate("/recover-password");
            }}
          >
            Recuperar contraseña
          </Link>
        </p>
        {errors.password && (
          <span className="input__error">{errors.password}</span>
        )}
      </div>
      <Button text="Iniciar sesión" type="btn-primary" onClick={handleLogin} />
      <div className="auth__another">
        <div className="line"></div>
        <span>o</span>
        <div className="line"></div>
      </div>
      <button className="btn__g-button" onClick={signInWithGoogle}>
        <img src={gLogo} width="20" height="20" alt="G de Google" /> Inicia
        sesión con Google
      </button>
      <p>
        ¿No tienes cuenta todavía?{" "}
        <Link
          to="/register"
          onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}
        >
          Crea una cuenta
        </Link>
      </p>
    </main>
  );
};

export default Login;
