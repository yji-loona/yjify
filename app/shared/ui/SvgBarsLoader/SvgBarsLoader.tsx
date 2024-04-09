import { FC } from "react";

export const SvgBarsLoader: FC = () => {
    return (
        <div>
            <svg
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                width="24px"
                height="30px"
                viewBox="0 0 24 30">
                <rect
                    x="0"
                    y="30"
                    width="4"
                    height="30"
                    fill="rgb(var(--main-color))"
                    opacity="0.2">
                    <animate
                        attributeName="opacity"
                        attributeType="XML"
                        values="0.2; 1; .2"
                        begin="0s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="height"
                        attributeType="XML"
                        values="10; 30; 10"
                        begin="0s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="y"
                        attributeType="XML"
                        values="10; 0; 10"
                        begin="0s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </rect>
                <rect
                    x="8"
                    y="30"
                    width="4"
                    height="30"
                    fill="rgb(var(--main-color))"
                    opacity="0.2">
                    <animate
                        attributeName="opacity"
                        attributeType="XML"
                        values="0.2; 1; .2"
                        begin="0.15s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="height"
                        attributeType="XML"
                        values="10; 30; 10"
                        begin="0.15s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="y"
                        attributeType="XML"
                        values="10; 0; 10"
                        begin="0.15s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </rect>
                <rect
                    x="16"
                    y="30"
                    width="4"
                    height="30"
                    fill="rgb(var(--main-color))"
                    opacity="0.2">
                    <animate
                        attributeName="opacity"
                        attributeType="XML"
                        values="0.2; 1; .2"
                        begin="0.3s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="height"
                        attributeType="XML"
                        values="10; 30; 10"
                        begin="0.3s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="y"
                        attributeType="XML"
                        values="10; 0; 10"
                        begin="0.3s"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </rect>
            </svg>
        </div>
    );
};
