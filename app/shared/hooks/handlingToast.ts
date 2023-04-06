import { handleToast, setMessage, IToast } from "app/shared/slices/toastSlice";

export const handlingToast = (
    dispatch: any,
    text: string,
    type?: IToast["type"],
    position?: IToast["position"]
) => {
    dispatch(handleToast({ show: true }));
    dispatch(
        setMessage({
            message: text,
            type: type,
            position: position,
        })
    );
};
