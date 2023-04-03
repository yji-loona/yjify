import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface StylesState {
    theme: "dark" | "light";
    color: "255, 255, 255" | "17, 17, 17";
    backgroundColor: "17, 17, 17" | "255, 255, 255";
}

const initialState: StylesState = {
    theme: "dark",
    color: "255, 255, 255",
    backgroundColor: "17, 17, 17",
};

const themeSlice = createSlice({
    name: "styles",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<{ theme: string }>) => {
            switch (action.payload.theme) {
                case "light":
                    state.theme = action.payload.theme;
                    state.color = "17, 17, 17";
                    state.backgroundColor = "255, 255, 255";
                    break;
                case "dark":
                    state.theme = action.payload.theme;
                    state.backgroundColor = "17, 17, 17";
                    state.color = "255, 255, 255";
                    break;
            }
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
