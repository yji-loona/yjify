import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
    isOpen: boolean;
}

const initialState: SidebarState = {
    isOpen: true,
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
    },
});

export const { openSidebar, closeSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
