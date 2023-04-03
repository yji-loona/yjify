import React, { useState, useRef, useEffect } from "react";
import style from "./style.module.scss";

type TooltipProps = {
    text: string;
    isHovered: boolean;
    position?: "top" | "bottom" | "left" | "right";
    border?: string;
    background?: string;
};

// const TooltipContainer = styled.div<{ position: TooltipProps["position"] }>`
//     position: relative;
//     display: inline-block;

//     &:hover .tooltip {
//         visibility: visible;
//         opacity: 1;
//     }

//     .tooltip {
//         position: absolute;
//         visibility: hidden;
//         opacity: 0;
//         background-color: #000;
//         color: #fff;
//         padding: 10px;
//         border-radius: 5px;
//         font-size: 14px;
//         z-index: 1;
//         transition: opacity 0.3s;

//         ${props => {
//             switch (props.position) {
//                 case "top":
//                     return `
//             bottom: 100%;
//             left: 50%;
//             transform: translateX(-50%);
//           `;
//                 case "bottom":
//                     return `
//             top: 100%;
//             left: 50%;
//             transform: translateX(-50%);
//           `;
//                 case "left":
//                     return `
//             top: 50%;
//             right: 100%;
//             transform: translateY(-50%);
//           `;
//                 case "right":
//                     return `
//             top: 50%;
//             left: 100%;
//             transform: translateY(-50%);
//           `;
//                 default:
//                     return `
//             bottom: 100%;
//             left: 50%;
//             transform: translateX(-50%);
//           `;
//             }
//         }}
//     }
// `;

const Tooltip: React.FC<TooltipProps> = ({
    text,
    isHovered,
    border,
    background,
    position = "top",
}) => {
    const [showTooltip, setShowTooltip] = useState(isHovered);
    useEffect(() => {
        setShowTooltip(isHovered);
    }, [isHovered]);

    return <div className={`${style.tooltip} ${showTooltip && style.tooltip_show}`}>{text}</div>;
};

export default Tooltip;
