import React, {useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/buttons/Button";
import logo from "../assets/images/habituo-logo.svg";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "react-feather";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav id="navbar" className="container mb-4">
      <div className="nav__logotype">
        <a href="https://habituo.app/">
          <img
            src={logo}
            width="200"
            height
            alt="Habituo App - Tracker de hábitos"
          />
        </a>
      </div>
      <div className="nav__menu">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/dashboard">Tablero</Link>
          </li>
        </ul>
      </div>
      <div className="nav__buttons">
        {user ? (
          <>
            <div className="user-card" onClick={toggleDropdown}>
              {user.photoURL ? (
                <img
                  src={`//wsrv.nl/?url=${user.photoURL}`}
                  alt="Foto del usuario"
                  width="40"
                  height="40"
                />
              ) : (
                <div
                  className="user-avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: `#${Math.floor(
                      Math.random() * 16777215
                    ).toString(16)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: "18px",
                  }}
                >
                  {user.displayName
                    ? user.displayName[0].toUpperCase()
                    : user.email[0].toUpperCase()}
                </div>
              )}
              <div className="user-info">
                <span className="user-name">
                  {user.displayName || user.email.split("@")[0]}
                </span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <div ref={dropdownRef} className={`dropdown__content ${dropdownActive ? "active" : ""}`}>
              <div className="content__card">
                <div className="card__icon">
                  <Settings color="#0d0d0d" size="20" />
                </div>
                <div className="card__info">
                  <p onClick={logout}>Preferencias</p>
                  <span>Ajustes de la cuenta </span>
                </div>
              </div>
              <div className="content__card">
                <div className="card__icon">
                  <LogOut color="#0d0d0d" size="20" />
                </div>
                <div className="card__info">
                  <p onClick={logout}>Cerrar sesión</p>
                  <span>Cierra la sesión actual</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Button
              text="Crear cuenta"
              type="btn-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            />
            <Button
              text="Iniciar sesión"
              type="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
