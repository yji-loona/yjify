import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICurrentPage {
    pageType: string;
}

const initialState: ICurrentPage = {
    pageType: "mainPage",
};

export const currentPageSlice = createSlice({
    name: "currentPage",
    initialState,
    reducers: {
        setPageType: (state, action: PayloadAction<string>) => {
            state.pageType = action.payload;
        },
    },
});

export const { setPageType } = currentPageSlice.actions;

export default currentPageSlice.reducer;
