import React from 'react';
import styles from './Button.module.css';

const Button = ({ text, onClick, type, styleType = 'btn-primary', ...props }) => {
  const buttonClass = `${styles.btn} ${styles[styleType]}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick} {...props}>
      {text}
    </button>
  );
};

export default Button;