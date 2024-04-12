import { useEffect } from 'react';

export function useLockBodyScroll(lock) {
    useEffect(() => {

        const preventDefault = (e) => e.preventDefault();

        if (lock) {
            document.body.style.overflow = 'hidden';
            document.body.addEventListener('touchmove', preventDefault, { passive: false });
        }

        return () => {
            document.body.style.overflow = '';
            document.body.removeEventListener('touchmove', preventDefault, { passive: false });
        };
    }, [lock]);
}
