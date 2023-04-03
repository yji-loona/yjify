import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface IToast {
    message: any;
    showState: boolean;
    type?: "success" | "error" | "warning" | "message";
    position?: "top" | "right" | "bottom" | "left";
    handleToast: () => void;
}

const Toast: React.FC<IToast> = ({
    showState,
    message,
    position = "top",
    type = "message",
    handleToast,
}) => {
    useEffect(() => {
        if (showState) {
            const timeout = setTimeout(handleToast, 5000);
            return () => clearTimeout(timeout);
        }
    }, [showState]);

    if (showState) {
        return ReactDOM.createPortal(
            <div
                style={{
                    position: "fixed",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "12px 24px",
                    backgroundColor: type === "error" ? "red" : "green",
                    color: "white",
                    borderRadius: "4px",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                    zIndex: 15000,
                }}>
                {message}
            </div>,
            document.body
        );
    }

    return null;
};

export default Toast;
