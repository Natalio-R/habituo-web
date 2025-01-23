import React from 'react';
import styles from './Toast.module.css';
import { CheckCircle, XCircle, Info } from "react-feather";

const Toast = ({ isOpen, onClose, message, type, action, promise }) => {
    let IconComponent;

    if (type === 'success') {
        IconComponent = <CheckCircle size={20} color={"#ffffff"} />;
    } else if (type === 'error') {
        IconComponent = <XCircle size={20} />;
    } else if (type === 'info') {
        IconComponent = <Info size={20} />;
    } else {
        IconComponent = "";
    }

    return (
        <div className={`${styles.toast__container} ${styles[type]}`} >
            <div className={styles.modal__content}>
                {IconComponent}
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Toast;
