import React from "react";
import style from "./style.module.scss";

const SvgLoader = () => {
    return (
        <svg className={style.svg}>
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(var(--additionalMixColor))">
                        <animate
                            attributeName="offset"
                            values="-2; 1"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="50%" stopColor="rgb(var(--main-color))">
                        <animate
                            attributeName="offset"
                            values="-1.5; 1.5"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </stop>
                    <stop offset="100%" stopColor="rgb(var(--additionalMixColor))">
                        <animate
                            attributeName="offset"
                            values="-1; 2"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </stop>
                </linearGradient>
            </defs>
            <rect fill="url(#gradient)" />
        </svg>
    );
};

export default SvgLoader;
