import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { AllHabits, LeftColumn } from "../../routes/index";
import customTheme from "../../theme/theme";
import { useTheme } from "../../theme/ThemeContext";
import { ChakraProvider } from "@chakra-ui/react";

const Dashboard = () => {
  const { themeOptions, updateTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const resizer1Ref = useRef(null);
  const resizer2Ref = useRef(null);
  const location = useLocation();
  const isAllHabitsPage = location.pathname === "/dashboard/all-habits";

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

    return () => {
      resizer1Ref.current?.removeEventListener("mousedown", handleMouseDown);
      resizer2Ref.current?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <ChakraProvider
      theme={customTheme(
        themeOptions.focusColor,
        themeOptions.fontFamily,
        themeOptions.borderRadius
      )}
    >
      <div id="dashboard" ref={containerRef}>
        <div ref={col1Ref} className="column" id="col1">
          {user ? <LeftColumn userInfo={user} /> : null}

          {/* <div className="column__lists">
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
                  <li key={area.id} className="list__item">
                    <Link to={`/area/${area.id}`}>{area.name}</Link>
                  </li>
                ))}
              </>
            )}
            <li className="list__item">
              <Link to="/dashboard">
                <Plus size={20} color="#2a2a2a" />
                Añadir nueva
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
        </div> */}
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
          {isAllHabitsPage ? <AllHabits /> : <p>Hola</p>}
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
    </ChakraProvider>
  );
};

export default Dashboard;
