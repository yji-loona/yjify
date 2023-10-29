import React, { useState, useRef, useEffect } from "react";
import style from "./style.module.scss";

type TooltipProps = {
    text: string;
    isHovered: boolean;
    position?: "top" | "bottom" | "left" | "right";
    border?: string;
    background?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ text, isHovered }) => {
    const [showTooltip, setShowTooltip] = useState(isHovered);
    useEffect(() => {
        setShowTooltip(isHovered);
    }, [isHovered]);

    return <div className={`${style.tooltip} ${showTooltip && style.tooltip_show}`}>{text}</div>;
};

export default Tooltip;
