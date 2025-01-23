import React, { useState } from "react";
import { Link } from "react-router-dom";
import gLogo from "../../assets/images/icons/g-icon.webp";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../hooks/firebase";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (formData.name.length > 20) {
      newErrors.name = "El nombre no puede tener más de 20 caracteres.";
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password)
    ) {
      newErrors.password = "La contraseña debe tener mayúsculas y minúsculas.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos un número.";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password =
        "La contraseña debe tener al menos un carácter especial (!@#$%^&*).";
    }

    // Validate password confirm
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Usuario registrado:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar usuario con Google:", error);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Usuario registrado:", result.user);
      navigate("/dashboard");
    } catch (error) {
      if (errors.code === "auth/email-already-in-use") {
        setErrors({ email: "El correo ya está en uso." });
      } else {
        console.error("Error al registrsr el usuario.", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <main id="register" className="container">
      <h1>Crea tu cuenta</h1>
      <div className="input__group">
        <label htmlFor="email">Nombre completo</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          placeholder="Nombre Apellido/s"
          onChange={handleInputChange}
        />
        {errors.name && <p className="input__error">{errors.name}</p>}
      </div>
      <div className="input__group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="nombre@gmail.com"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="input__error">{errors.email}</p>}
      </div>
      <div className="input__group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••••"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="input__error">{errors.password}</p>}
      </div>
      <div className="input__group">
        <label htmlFor="password">Repetir contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="••••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {errors.confirmPassword && (
          <p className="input__error">{errors.confirmPassword}</p>
        )}
      </div>
      <Button
        text="Registrarse"
        type="button"
        styleType="btn-primary"
        onClick={handleRegister}
      />
      <div className="auth__another">
        <div className="line"></div>
        <span>o</span>
        <div className="line"></div>
      </div>
      <button className="btn__g-button" onClick={registerWithGoogle}>
        <img src={gLogo} width="20" height="20" alt="Google logo" /> Registrarse
        con Google
      </button>
      <p>
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
        >
          Inicia sesión
        </Link>
      </p>
    </main>
  );
};

export default Register;
