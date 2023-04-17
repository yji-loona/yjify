import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
    isOpen: boolean;
    width: number;
}

const initialState: SidebarState = {
    isOpen: true,
    width: 240,
};

export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        openSidebar: state => {
            state.isOpen = true;
        },
        closeSidebar: state => {
            state.isOpen = false;
        },
        setWidth: (state, action: PayloadAction<number>) => {
            state.width = action.payload;
        },
    },
});

export const { openSidebar, closeSidebar, setWidth } = sidebarSlice.actions;

export default sidebarSlice.reducer;
