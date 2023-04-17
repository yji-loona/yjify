import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import sidebarReducer from "app/shared/slices/sidebarSlice";
import playlistsSlice from "app/shared/slices/playlistsSlice";
import userSlice from "app/shared/slices/userSlice";
import themeSlice from "app/shared/slices/themeSlice";
import trackSlice from "app/shared/slices/trackSlice";
import toastSlice from "app/shared/slices/toastSlice";
import currentPage from "app/shared/slices/currentPage";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, sidebarReducer);
const persistTheme = persistReducer(persistConfig, themeSlice);

const store = configureStore({
    reducer: {
        sidebar: persistedReducer,
        playlists: playlistsSlice,
        user: userSlice,
        theme: persistTheme,
        track: trackSlice,
        toast: toastSlice,
        page: currentPage,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
