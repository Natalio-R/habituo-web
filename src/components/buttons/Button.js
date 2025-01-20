import React from 'react';
import styles from './Button.module.css';

const Button = ({ text, onClick, type = 'btn-primary', ...props }) => {
  const buttonClass = `${styles.btn} ${styles[type]}`;

  return (
    <button type="button" className={buttonClass} onClick={onClick} {...props}>
      {text}
    </button>
  );
};

export default Button;