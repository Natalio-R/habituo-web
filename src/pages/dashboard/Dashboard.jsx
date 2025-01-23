import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { Settings, LogOut, Inbox, List, Plus } from "react-feather";
import { ColumnHeader, AllHabits } from "../../routes/index";
import Modal from "../../components/modals/Modal";
import { Toast } from "../../routes/index";

const Dashboard = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const [areas, setAreas] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const resizer1Ref = useRef(null);
  const resizer2Ref = useRef(null);
  const buttonRef = useRef(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState(false);

  const handleOpenModal = (type, areaId) => {
    setType(type);
    if (areaId && type === "area") {
      setSelectedArea(areas.find(area => area.id === areaId));
    }
    setIsModalOpen(true);
  };

  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const handleContextMenu = (e, area) => {
    e.preventDefault();

    // Establecer el área seleccionada
    setSelectedArea(area);

    // Establecer la posición del botón para que se muestre en el lugar adecuado
    setButtonPosition({
      x: e.clientX, // Posición horizontal
      y: e.clientY, // Posición vertical
    });

    // Mostrar el botón de editar
    setShowEditButton(true);
  };

  const fetchAreas = async () => {
    if (!user) return;

    try {
      const areasRef = collection(db, "users", user.uid, "areas");

      const unsubscribe = onSnapshot(areasRef, (snapshot) => {
        const areasList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAreas(areasList);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error al obtener las áreas: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [user]);

  useEffect(() => {
    let isResizing = false;
    let activeResizer = null;
    let startX = 0;
    let initialWidths = {};

    const handleMouseDown = (e, resizer) => {
      isResizing = true;
      activeResizer = resizer;
      startX = e.clientX;

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
      const { col1, col3, container } = initialWidths;

      if (activeResizer === resizer1Ref.current) {
        let newCol1Width = col1 + (deltaX / container) * 100;
        newCol1Width = Math.max(13, Math.min(newCol1Width, 16));

        const newCol2Width = 100 - newCol1Width - col3;

        col1Ref.current.style.width = `${newCol1Width}%`;
        col2Ref.current.style.width = `${newCol2Width}%`;
      } else if (activeResizer === resizer2Ref.current) {
        let newCol3Width = col3 - (deltaX / container) * 100;
        newCol3Width = Math.max(20, Math.min(newCol3Width, 50));

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

    resizer1Ref.current.addEventListener("mousedown", (e) =>
      handleMouseDown(e, resizer1Ref.current)
    );
    resizer2Ref.current.addEventListener("mousedown", (e) =>
      handleMouseDown(e, resizer2Ref.current)
    );

    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setShowEditButton(false); // Ocultar el botón si se hace clic fuera de él
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      resizer1Ref.current?.removeEventListener("mousedown", handleMouseDown);
      resizer2Ref.current?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClickOutside);
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
                Todas las áreas
              </Link>
              <span className="item__count">{areas.length}</span>
            </li>
            {loading ? (
              <li className="list__item loading">
                <span className="skeleton"></span>
              </li>
            ) : (
              <>
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="list__item"
                    onContextMenu={(e) => handleContextMenu(e, area)}
                  >
                    <Link to={`/area/${area.id}`}>{area.name}</Link>
                  </li>
                ))}
              </>
            )}
            <li className="list__item">
              <Link
                to="/dashboard"
                onClick={() => {
                  handleOpenModal("area", null);
                }}
              >
                <Plus size={20} color="#2a2a2a" />
                Añadir nueva
              </Link>
            </li>
          </ul>
          {showEditButton && selectedArea && (
            <button
              ref={buttonRef}
              style={{
                position: "absolute",
                left: `${buttonPosition.x}px`,
                top: `${buttonPosition.y}px`,
              }}
              onClick={() => {
                if (selectedArea) {
                  setIsAreaModalOpen(true);
                  handleOpenModal("area-edit", selectedArea.id);
                }
              }}
            >
              Editar
            </button>
          )}
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
        <ColumnHeader
          title="Todos los hábitos"
          buttons={["search", "date", "order", "actions"]}
        />
        <AllHabits />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type={type}
            areaId={selectedArea?.id}
            setToast={setToast}
          />
          <Toast
        isOpen={!!toast}
        onClose={() => setToast(null)}
        type={toast?.type}
        message={toast?.message}
      />
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
