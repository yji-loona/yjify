import React from "react";
import style from "./style.module.scss";
import { setTheme } from "app/shared/slices/themeSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";

const ThemeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    function changeTheme() {
        switch (theme.theme) {
            case "dark":
                dispatch(setTheme({ theme: "light" }));
                break;
            case "light":
                dispatch(setTheme({ theme: "dark" }));
                break;
        }
    }
    return (
        <label className={style.label} htmlFor="theme">
            <input
                onChange={changeTheme}
                id="theme"
                name="theme"
                checked={theme.theme === "dark" ? true : false}
                className={style["toggle-checkbox"]}
                type="checkbox"></input>
            <div className={style["toggle-slot"]}>
                <div className={style["sun-icon-wrapper"]}>
                    <i className={"fa-regular fa-sun " + style["sun-icon"]}></i>
                </div>
                <div className={style["toggle-button"]}></div>
                <div className={style["moon-icon-wrapper"]}>
                    <i className={"fa-solid fa-moon " + style["moon-icon"]}></i>
                </div>
            </div>
        </label>
    );
};

export default ThemeToggle;
