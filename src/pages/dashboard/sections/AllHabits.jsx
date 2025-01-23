import React, { useState } from "react";
import { Modal, Toast } from "../../../routes/index";

const AllHabits = () => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  return (
    <div>
      <button onClick={() => setIsHabitModalOpen(true)}>
        Abrir Modal de Hábito
      </button>

      <Modal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        type="habit"
        areaId="tuAreaId"
        setToast={setToast}
      />

      <Toast
        isOpen={!!toast}
        onClose={() => setToast(null)}
        type={toast?.type}
        message={toast?.message}
      />
    </div>
  );
};

export default AllHabits;
