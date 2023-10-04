import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaylist } from "app/shared/models/interfaces";

interface IPlaylistsState {
    playlistId: string;
    playlist: IPlaylist | null;
    playlistColor?: string;
}

const initialState: IPlaylistsState = {
    playlistId: "",
    playlist: null,
    playlistColor: "",
};

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setPlaylistId: (state, action: PayloadAction<{ playlistId: string }>) => {
            const { playlistId } = action.payload;
            if (!playlistId) {
                state.playlistColor = "";
            }
            state.playlistId = playlistId;
        },
        getPlaylist: (state, action: PayloadAction<any>) => {
            state.playlist = action.payload;
        },
        setColor: (state, action: PayloadAction<string>) => {
            state.playlistColor = action.payload;
        },
    },
});

export const { setPlaylistId, getPlaylist, setColor } = playlistsSlice.actions;

export default playlistsSlice.reducer;
