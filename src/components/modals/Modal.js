import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import { db } from '../../hooks/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../hooks/firebase';
import { X, CheckCircle } from "react-feather";
import { Button } from "../../routes/index";
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const Modal = ({ isOpen, onClose, type, areaId, setToast  }) => {
    const [user] = useAuthState(auth);

    // Estado común
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [formError, setFormError] = useState('');

    // Estados específicos del hábito
    const [goal, setGoal] = useState('');
    const [unit, setUnit] = useState('');
    const [frequency, setFrequency] = useState('');
    const [startDate, setStartDate] = useState('');
    const [reminderTime, setReminderTime] = useState('18:00');

    useEffect(() => {
        if (type === 'area' && areaId) {
            const fetchArea = async () => {
                try {
                    const areaRef = doc(db, 'users', user.uid, 'areas', areaId);
                    const docSnap = await getDoc(areaRef);
                    if (docSnap.exists()) {
                        const areaData = docSnap.data();
                        setName(areaData.name);
                    }
                } catch (e) {
                    console.error('Error al obtener el área: ', e);
                }
            };

            fetchArea();
        }
        if (type === 'area-edit') {
            const fetchArea = async () => {
                try {
                    const areaRef = doc(db, 'users', user.uid, 'areas', areaId);
                    const docSnap = await getDoc(areaRef);
                    if (docSnap.exists()) {
                        const areaData = docSnap.data();
                        setName(areaData.name);
                    }
                } catch (e) {
                    console.error('Error al obtener el área: ', e);
                }
            };

            fetchArea();
        }
    }, [isOpen, type, areaId, user]);

    const validateName = () => {
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{1,40}$/;
        if (!name.trim()) {
            setNameError('El nombre no puede estar vacío.');
            return false;
        }
        if (!nameRegex.test(name)) {
            setNameError('El nombre solo puede contener letras y espacios (máx. 40 caracteres).');
            return false;
        }
        setNameError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!validateName()) return;

        const habitStartDate = startDate || new Date().toISOString().split('T')[0];

        if (type === 'area' && user) {
            try {
                const areasRef = collection(db, 'users', user.uid, 'areas');
                const docRef = await addDoc(areasRef, { name });

                console.log('Área añadida con ID: ', docRef.id);
                onClose();
            } catch (e) {
                console.error('Error al agregar el área: ', e);
                setFormError('No se pudo guardar el área. Inténtalo de nuevo.');
            }
        } else if (type === 'habit' && user && areaId) {
            try {
                const habitsRef = collection(db, 'users', user.uid, 'areas', areaId, 'habits');
                const docRef = await addDoc(habitsRef, {
                    habitName: name,
                    goal,
                    unit,
                    frequency,
                    startDate: habitStartDate,
                    reminderTime,
                });

                console.log('Hábito añadido con ID: ', docRef.id);
                onClose();
            } catch (e) {
                console.error('Error al agregar el hábito: ', e);
                setFormError('No se pudo guardar el hábito. Inténtalo de nuevo.');
            }
        } else if (type === 'area-edit' && user && areaId) {
            try {
                const areaRef = doc(db, 'users', user.uid, 'areas', areaId);
                await updateDoc(areaRef, { name });

                setToast({
                    type: 'success',
                    message: 'Área actualizada con éxito.',
                });

                onClose();
            } catch (e) {
                setToast({
                    type: 'error',
                    message: 'Error al actualizar el área.',
                });
                setFormError('No se pudo actualizar el área. Inténtalo de nuevo.');
            }
        }


        if (type === 'area-edit') {
            updateArea().then(onClose).catch(handleError);
        }

    };

    const handleError = (error) => {
        console.error('Ocurrió un error:', error);
        setFormError('Algo salió mal. Inténtalo de nuevo.');
    };

    const deleteArea = async () => {
        const areaRef = doc(db, 'users', user.uid, 'areas', areaId);
        await deleteDoc(areaRef);
        onClose(); // Cerrar modal después de eliminar
    };

    const updateArea = async () => {
        const areaRef = doc(db, 'users', user.uid, 'areas', areaId);
        await updateDoc(areaRef, { name });
        onClose(); // Cerrar modal después de actualizar
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal__container}>
            <div className={styles.modal__content}>
                <div className={styles.content__header}>
                    <h2>{(type === 'area' || type === 'area-edit') ? 'Registrar área' : 'Registrar hábito'}</h2>
                    <X size={20} color={'#000000'} onClick={onClose} className={styles.close} />
                </div>
                <form onSubmit={handleSubmit} className={styles.content__form}>
                    {type === 'habit' && (
                        <>
                            <div className={styles.input__group}>
                                <label>Escribe un hábito:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Caminar, correr, leer un libro..."
                                />
                                {nameError && <p className={styles.input__error}>{nameError}</p>}
                            </div>
                            <div className={`${styles.input__group} ${styles.group__two}`}>
                                <label>Meta:</label>
                                <div className={styles.inputs}>
                                    <input
                                        type="number"
                                        min={1}
                                        max={9999}
                                        defaultValue={1}
                                        value={goal}
                                        onChange={(e) => {
                                            const value = Math.max(1, Math.min(99999, Number(e.target.value)));
                                            setGoal(value);
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value < 1) setGoal(1);
                                            if (e.target.value > 99999) setGoal(99999);
                                        }}
                                    />
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    >
                                        <option value="">Selecciona unidad</option>
                                        <option value="metres">Metros</option>
                                        <option value="kilometres">Kilómetros</option>
                                        <option value="hours">Horas</option>
                                        <option value="minutes">Minutos</option>
                                    </select>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <option value="">Selecciona frecuencia</option>
                                        <option value="daily">Diaria</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="monthly">Mensual</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${styles.input__group} ${styles.group__three}`}>
                                <div className={styles.inputs}>
                                    <label>Fecha de comienzo:</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className={styles.inputs}>
                                    <label>Hora de recordatorio:</label>
                                    <input
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'area' && (
                        <div className={styles.input__group}>
                            <label>Nombre del área</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Escribe el nombre del área"
                            />
                            {nameError && <p className={styles.input__error}>{nameError}</p>}
                        </div>
                    )}

                    {type === 'area-edit' && (
                        <div className={styles.input__group}>
                            <label>Nombre del área</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Escribe el nombre del área"
                            />
                            {nameError && <p className={styles.input__error}>{nameError}</p>}
                        </div>
                    )}

                    {formError && <p className={styles.input__error}>{formError}</p>}

                    {type === 'area-edit' && (
                        <div className={styles.buttons__group}>
                            <Button text="Eliminar" type="button" styleType="btn-danger" onClick={() => {
                                deleteArea()
                                    .then(() => {
                                        onClose();
                                    })
                                    .catch((error) => {
                                        console.error('Error al eliminar el área:', error);
                                        setFormError('No se pudo eliminar el área. Inténtalo de nuevo.');
                                    });
                            }} />
                            <Button text="Editar" type="submit" styleType="btn-primary" />
                        </div>
                    )}

                    {type === 'area' && (
                        <div className={styles.buttons__group}>
                            <Button text="Cancelar" type="button" styleType="btn-link" onClick={onClose} />
                            <Button text={`Añadir ${type === 'area' ? 'área' : 'hábito'}`} type="submit" styleType="btn-primary" />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Modal;
