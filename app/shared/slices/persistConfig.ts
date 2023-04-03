import storage from "redux-persist/lib/storage";
import sidebarReducer from "app/shared/slices/sidebarSlice";
import themeReducer from "app/shared/slices/themeSlice";
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

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, sidebarReducer);
const persistTheme = persistReducer(persistConfig, themeReducer);

export default { persistedReducer, persistTheme };
