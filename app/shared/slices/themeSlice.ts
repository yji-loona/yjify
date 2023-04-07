import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

export const primaryColors = [
    { red: "255, 65, 54" },
    { orange: "255, 140, 0" },
    { gold: "255, 199, 0" },
    { green: "30, 215, 96" },
    { blue: "0, 116, 217" },
    { pink: "255, 128, 204" },
    { purple: "177, 13, 201" },
];
type PrimaryColor = keyof typeof primaryColors[number];

interface StylesState {
    theme: "dark" | "light";
    color: "255, 255, 255" | "17, 17, 17";
    backgroundColor: "17, 17, 17" | "255, 255, 255";
    additionalMixColor: "34, 34, 34" | "238, 238, 238";
    mainColor: PrimaryColor;
}

const initialState: StylesState = {
    theme: "dark",
    color: "255, 255, 255",
    backgroundColor: "17, 17, 17",
    additionalMixColor: "34, 34, 34",
    mainColor: "red",
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
                    state.additionalMixColor = "238, 238, 238";
                    break;
                case "dark":
                    state.theme = action.payload.theme;
                    state.backgroundColor = "17, 17, 17";
                    state.color = "255, 255, 255";
                    state.additionalMixColor = "34, 34, 34";
                    break;
            }
        },
        setColorScheme: (state, action: PayloadAction<any>) => {
            state.mainColor = action.payload;
        },
    },
});

export const { setTheme, setColorScheme } = themeSlice.actions;
export default themeSlice.reducer;
