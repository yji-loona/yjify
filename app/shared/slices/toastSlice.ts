import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type } from "os";

export interface IToast {
    isActive: boolean;
    message: string;
    type: "success" | "error" | "warning" | "message";
    position: "top" | "right" | "bottom" | "left";
}

const initialState: IToast = {
    isActive: false,
    message: "",
    type: "message",
    position: "top",
};

export const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        handleToast: (state, action: PayloadAction<{ show: boolean }>) => {
            state.isActive = action.payload.show;
        },
        setMessage: (
            state,
            action: PayloadAction<{
                message: string;
                type?: IToast["type"];
                position?: IToast["position"];
            }>
        ) => {
            state.message = action.payload.message;
            action.payload.type ? (state.type = action.payload.type) : (state.type = "message");
            action.payload.position
                ? (state.position = action.payload.position)
                : (state.position = "top");
        },
    },
});

export const { handleToast, setMessage } = toastSlice.actions;

export default toastSlice.reducer;
