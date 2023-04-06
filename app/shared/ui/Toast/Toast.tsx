import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { handleToast } from "app/shared/slices/toastSlice";
import { RootState } from "app/shared/store/store";

interface IToast {
    showState: boolean;
}

const Toast: React.FC<IToast> = ({ showState }) => {
    const [initAnim, setInitAnim] = useState<"animIn" | "animOut" | "">("");
    const dispatch = useDispatch();
    const message = useSelector((state: RootState) => state.toast.message);
    const position = useSelector((state: RootState) => state.toast.position);
    const type = useSelector((state: RootState) => state.toast.type);
    const closeToast = () => {
        setInitAnim("animOut");
        const close = setTimeout(() => dispatch(handleToast({ show: false })), 200);
        return () => clearTimeout(close);
    };
    useEffect(() => {
        if (showState) {
            setInitAnim("animIn");
            const timeout = setTimeout(closeToast, 5000);
            const animOut = setTimeout(() => setInitAnim("animOut"), 4800);
            return () => {
                clearTimeout(timeout);
                clearTimeout(animOut);
            };
        } else {
            setInitAnim("");
        }
    }, [showState]);
    const secPosition = position === ("top" || "bottom") ? "left" : "top";
    const translate = position === ("top" || "bottom") ? "translateX" : "translateY";
    const style = {
        [position]: "10px",
        [secPosition]: "50%",
        transform: `${translate}(-50%) ${initAnim === "animIn" ? "scale(1)" : "scale(0)"}`,
    };

    if (showState) {
        return ReactDOM.createPortal(
            <div
                className={styles.toast + " " + styles[initAnim]}
                style={style}
                onClick={closeToast}>
                {type === "success" && (
                    <i className="fa-solid fa-circle-check" style={{ color: "green" }}></i>
                )}
                {type === "warning" && (
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: "yellow" }}></i>
                )}
                {type === "error" && (
                    <i className="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                )}
                {message}
            </div>,
            document.body
        );
    }

    return null;
};

export default Toast;
