import { useSelector } from "react-redux";
import React, { HTMLAttributes, useState } from "react";
import style from "./style.module.scss";
import { RootState } from "app/shared/store/store";

interface SidebarNavProps extends HTMLAttributes<HTMLDivElement> {}

const SidebarNav = ({ children, ...props }: SidebarNavProps) => {
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    return (
        <div
            className={`${style.sidebar__nav} ${!isOpen ? style.sidebar__nav_rolled : ""}`}
            {...props}>
            {children}
        </div>
    );
};
export default SidebarNav;
