import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Session } from "next-auth";

export interface IUser {
    user: {
        name: string | null | undefined;
        email: string | null | undefined;
        image: {
            height: string | null | undefined;
            url: string;
            width: string | null | undefined;
        }[];
        accessToken: string | null | undefined;
        refreshToken: string | null | undefined;
        username: string | null | undefined;
    };
}

export const initialState = { user: <IUser>{} };

export const playlistsSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userInit: (state, action: PayloadAction<{ data: any }>) => {
            const { data } = action.payload;
            state.user = data;
        },
    },
});

export const { userInit } = playlistsSlice.actions;

export default playlistsSlice.reducer;
