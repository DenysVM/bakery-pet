import { useEffect } from 'react';

const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [ref, callback]);
};

export default useOutsideClick;
