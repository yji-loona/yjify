import { useSelector } from "react-redux";
import React, { HTMLAttributes, useState } from "react";
import style from "./style.module.scss";
import { RootState } from "app/shared/store/store";
import Tooltip from "app/shared/ui/Tooltip";

interface SidebarItemProps extends HTMLAttributes<HTMLButtonElement> {
    title?: string;
    onClick?: (e: any) => void;
}

const SidebarItem = ({ children, onClick = () => {}, title = "", ...props }: SidebarItemProps) => {
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <button
            className={`${style.sidebar_button} ${!isOpen ? style.sidebar_button__rolled : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}>
            {children}
            {!isOpen && <Tooltip text={title} isHovered={isHovered} />}
        </button>
    );
};
export default SidebarItem;
