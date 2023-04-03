import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaylist } from "app/shared/models/interfaces";

interface IPlaylistsState {
    trackId: string | null;
    isTrackPlaying: boolean;
}

const initialState: IPlaylistsState = {
    trackId: null,
    isTrackPlaying: false,
};

export const trackSlice = createSlice({
    name: "track",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<{ track: string }>) => {
            const { track } = action.payload;
            state.trackId = track;
        },
        handleTrackPlayer: (state, action: PayloadAction<boolean>) => {
            state.isTrackPlaying = action.payload;
        },
    },
});

export const { setTrack, handleTrackPlayer } = trackSlice.actions;

export default trackSlice.reducer;
