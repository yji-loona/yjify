import { useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import { primaryColors } from "app/shared/slices/themeSlice";

const Theme = () => {
    const { theme, color, backgroundColor, additionalMixColor, mainColor } = useSelector(
        (state: RootState) => state.theme
    );
    const formatedColor = primaryColors.filter(color => color[mainColor])[0][mainColor];

    const id = "yjify theme";
    let style = document.getElementById(id) as HTMLStyleElement;
    if (!style) {
        style = document.createElement("style");
        style.id = id;
        document.head.appendChild(style);
    }
    style.innerHTML = `:root {--theme: ${theme};--color: ${color};--background-color: ${backgroundColor};--additionalMixColor:${additionalMixColor};--main-color: ${formatedColor}}`;
    return null;
};

export default Theme;
