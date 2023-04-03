import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaylist } from "app/shared/models/interfaces";

interface IPlaylistsState {
    playlistId: string;
    playlist: any;
}

const initialState: IPlaylistsState = {
    playlistId: "",
    playlist: null,
};

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setPlaylistId: (state, action: PayloadAction<{ playlistId: string }>) => {
            const { playlistId } = action.payload;
            state.playlistId = playlistId;
        },
        getPlaylist: (state, action: PayloadAction<any>) => {
            state.playlist = action.payload;
        },
    },
});

export const { setPlaylistId, getPlaylist } = playlistsSlice.actions;

export default playlistsSlice.reducer;
