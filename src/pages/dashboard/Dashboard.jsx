import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { Settings, LogOut, Inbox, List } from "react-feather";
import { ColumnHeader } from "../../routes/index";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const resizer1Ref = useRef(null);
  const resizer2Ref = useRef(null);

  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownActive(false);
    }
  };

  useEffect(() => {
    let isResizing = false;
    let activeResizer = null;
    let startX = 0;
    let initialWidths = {};

    const handleMouseDown = (e, resizer) => {
      isResizing = true;
      activeResizer = resizer;
      startX = e.clientX;

      // Obtener anchos iniciales como porcentaje
      const containerWidth = containerRef.current.offsetWidth;
      initialWidths = {
        col1: (col1Ref.current.offsetWidth / containerWidth) * 100,
        col2: (col2Ref.current.offsetWidth / containerWidth) * 100,
        col3: (col3Ref.current.offsetWidth / containerWidth) * 100,
        container: containerWidth,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isResizing || !activeResizer) return;

      const deltaX = e.clientX - startX;
      const { col1, col2, col3, container } = initialWidths;

      if (activeResizer === resizer1Ref.current) {
        // Modificar primera y segunda columna
        let newCol1Width = col1 + (deltaX / container) * 100;
        newCol1Width = Math.max(12, Math.min(newCol1Width, 16)); // Limitar entre 12% y 16%

        const newCol2Width = 100 - newCol1Width - col3;

        col1Ref.current.style.width = `${newCol1Width}%`;
        col2Ref.current.style.width = `${newCol2Width}%`;
      } else if (activeResizer === resizer2Ref.current) {
        // Modificar segunda y tercera columna
        let newCol3Width = col3 - (deltaX / container) * 100;
        newCol3Width = Math.max(20, Math.min(newCol3Width, 50)); // Limitar entre 20% y 50%

        const newCol2Width = 100 - col1 - newCol3Width;

        col3Ref.current.style.width = `${newCol3Width}%`;
        col2Ref.current.style.width = `${newCol2Width}%`;
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      activeResizer = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Asignar eventos a los resizers
    resizer1Ref.current.addEventListener("mousedown", (e) =>
      handleMouseDown(e, resizer1Ref.current)
    );
    resizer2Ref.current.addEventListener("mousedown", (e) =>
      handleMouseDown(e, resizer2Ref.current)
    );

    return () => {
      // Cleanup eventos
      resizer1Ref.current?.removeEventListener("mousedown", handleMouseDown);
      resizer2Ref.current?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div id="dashboard" ref={containerRef}>
      <div ref={col1Ref} className="column" id="col1">
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
                    backgroundColor: `#${Math.floor(
                      Math.random() * 16777215
                    ).toString(16)}`,
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
            <div
              ref={dropdownRef}
              className={`dropdown__content ${dropdownActive ? "active" : ""}`}
            >
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
        ) : null}
        <div className="column__lists">
          <ul className="list">
            <li className="list__item active">
              <Link to="/dashboard">
                <Inbox size={20} color="#2a2a2a" />
                Todos los hábitos
              </Link>
            </li>
          </ul>
          <ul className="list">
            <span className="list__title">Áreas</span>
            <li className="list__item">
              <Link to="/dashboard">
                <Inbox size={20} color="#2a2a2a" />
                Todos los hábitos
              </Link>
            </li>
          </ul>
          <ul className="list">
            <span className="list__title">Preferencias</span>
            <li className="list__item">
              <Link to="/dashboard">
                <List size={20} color="#2a2a2a" />
                Gestionar hábitos
              </Link>
            </li>
            <li className="list__item">
              <Link to="/dashboard">
                <Settings size={20} color="#2a2a2a" />
                Ajustes
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        ref={resizer1Ref}
        className="resizer"
        id="resizer1"
        style={{
          width: "1px",
          cursor: "col-resize",
          backgroundColor: "#c5c5c5",
        }}
      ></div>
      <div ref={col2Ref} className="column" id="col2">
        <ColumnHeader title="Todos los hábitos" buttons={["search", "date", "order", "actions"]} />
      </div>
      <div
        ref={resizer2Ref}
        className="resizer"
        id="resizer2"
        style={{
          width: "1px",
          cursor: "col-resize",
          backgroundColor: "#c5c5c5",
        }}
      ></div>
      <div ref={col3Ref} className="column" id="col3" style={{ flex: 3 }}>
        3
      </div>
    </div>
  );
};

export default Dashboard;
