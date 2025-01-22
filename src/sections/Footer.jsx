import React from "react";
import logo from "../assets/images/habituo-logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="container mt-4">
      <div className="row py-5 menu__content">
        <div className="col-5 flex flex-column align-items-start justify-content-start">
          <a href="https://habituo.app/" className="image-link">
            <img
              src={logo}
              width="200"
              height
              alt="Habituo App - Tracker de hábitos"
            />
          </a>
          <p>
            Esto es un ejemplo de la descripción que va a tener Habituo en el
            footer.
          </p>
        </div>
        <div className="row col-7">
          <div className="col flex flex-column">
            <p className="mb-3 fs-5 footer__name-list">Compañía</p>
            <ul className="flex flex-column gap-3">
              <li className="fs-6">
                <a href="/">Inicio</a>
              </li>
              <li className="fs-6">
                <a href="/">Acerca de</a>
              </li>
              <li className="fs-6">
                <a href="/">Afiliados</a>
              </li>
              <li className="fs-6">
                <a href="/">Trabajos</a>
              </li>
            </ul>
          </div>
          <div className="col flex flex-column">
            <p className="mb-4 fs-5 footer__name-list">Producto</p>
            <ul className="flex flex-column gap-3">
              <li className="fs-6">
                <a href="/">Aplicación</a>
              </li>
              <li className="fs-6">
                <a href="/">Desarrolladores</a>
              </li>
              <li className="fs-6">
                <a href="/">Integraciones</a>
              </li>
              <li className="fs-6">
                <a href="/">Precios</a>
              </li>
            </ul>
          </div>
          <div className="col flex flex-column">
            <p className="mb-4 fs-5 footer__name-list">Recursos</p>
            <ul className="flex flex-column gap-3">
              <li className="fs-6">
                <a href="/">Código front</a>
              </li>
              <li className="fs-6">
                <a href="/">Código back</a>
              </li>
            </ul>
          </div>
          <div className="col flex flex-column">
            <p className="mb-4 fs-5 footer__name-list">Soporte</p>
            <ul className="flex flex-column gap-3">
              <li className="fs-6">
                <a href="/">Contacto</a>
              </li>
              <li className="fs-6">
                <a href="/">Reportar bug</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row p-5 copy__content">
        <div className="col flex flex-row justify-start">
          <span>&copy;{currentYear} Todos los derechos reservados</span>
        </div>
        <div className="col flex flex-row gap-5 justify-end">
          <a href="/" target="_blank" rel="noopener noreferrer">
            Términos y Condiciones
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
