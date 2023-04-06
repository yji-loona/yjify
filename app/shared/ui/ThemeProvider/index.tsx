import { useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";

const Theme = () => {
    const { theme, color, backgroundColor, additionalMixColor } = useSelector(
        (state: RootState) => state.theme
    );

    const id = "yjify theme";
    let style = document.getElementById(id) as HTMLStyleElement;
    if (!style) {
        style = document.createElement("style");
        style.id = id;
        document.head.appendChild(style);
    }
    style.innerHTML = `:root {--theme: ${theme};--color: ${color};--background-color: ${backgroundColor};--additionalMixColor:${additionalMixColor}}`;
    return null;
};

export default Theme;
