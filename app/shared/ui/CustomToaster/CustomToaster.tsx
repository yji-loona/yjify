import toast, { ToastBar, Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

export const CustomToaster = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 5000,
                style: {
                    width: "fit-content",
                    maxWidth: "90dvw",
                    color: "rgba(var(--color), 1)",
                    backgroundColor: "rgba(var(--main-color), .75)",
                    backdropFilter: "blur(.5rem)",
                },
            }}>
            {t => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <div
                            style={{ display: "flex", width: "fit-content" }}
                            onClick={() => toast.dismiss(t.id)}>
                            {icon}
                            {message}
                        </div>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};
