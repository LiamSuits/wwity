import { useEffect, useState } from "react";

const Toast = ({ message, onClose }) => {
    const [fadeout, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setFadeOut(true); // trigger fade out
        }, 700); // start fade-out before removing

        const timer2 = setTimeout(() => {
            onClose(); // remove from DOM
        }, 1000); // total time matches animation

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