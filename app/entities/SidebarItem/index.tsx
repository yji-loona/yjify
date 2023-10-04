import { useSelector } from "react-redux";
import React, { HTMLAttributes, useState } from "react";
import style from "./style.module.scss";
import { RootState } from "app/shared/store/store";
import Tooltip from "app/shared/ui/Tooltip";

interface SidebarItemProps extends HTMLAttributes<HTMLButtonElement> {
    linkedPages: string[];
    title?: string;
    onClick?: (e: any) => void;
}

const SidebarItem = ({
    linkedPages,
    children,
    onClick = () => {},
    title = "",
    ...props
}: SidebarItemProps) => {
    const { pageType } = useSelector((state: RootState) => state.page);
    const { isOpen } = useSelector((state: RootState) => state.sidebar);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <button
            style={linkedPages.includes(pageType) ? { color: "rgb(var(--main-color))" } : {}}
            className={`${style.sidebar_button} ${!isOpen ? style.sidebar_button__rolled : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            {...props}>
            {children}
            {!isOpen && <Tooltip text={title} isHovered={isHovered} />}
        </button>
    );
};
export default SidebarItem;
