import { useEffect, useState } from "react";

const Toast = ({ message, onClose }) => {
    const [fadeout, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setFadeOut(true);
        }, 700);

        const timer2 = setTimeout(() => {
            onClose();
        }, 1000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onClose]);

    return (
        <div className={`fixed top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2
        rounded-md shadow-lg z-50 ${fadeout ? 'animate-fade-out' : ""}`}>
            {message}
        </div>
    );
}

export default Toast