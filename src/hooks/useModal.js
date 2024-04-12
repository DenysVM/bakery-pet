import { useState } from 'react';

const useModal = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const toggle = () => {
        setModalOpen(!isModalOpen);
    };

    return {
        isModalOpen,
        toggle,
        open: () => setModalOpen(true),
        close: () => setModalOpen(false)
    };
};

export default useModal;
