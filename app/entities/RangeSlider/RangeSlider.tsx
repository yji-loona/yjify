import { useCallback, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

interface RangeProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    changeAfterMouseUp?: boolean;
}

const Range: React.FC<RangeProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    changeAfterMouseUp = false,
}) => {
    const [dragging, setDragging] = useState(false);
    const [pendingValue, setPendingValue] = useState(value);
    const rangeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(() => {
        setDragging(true);
    }, []);

    const handleChange = useCallback(
        (newValue: number) => {
            let clampedValue = Math.min(Math.max(newValue, min), max);
            onChange(clampedValue);
        },
        [max, min, onChange]
    );

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!dragging || !rangeRef.current) {
                return;
            }

            const range = rangeRef.current.getBoundingClientRect();
            const position = event.clientX - range.left;
            const percentage = (position / range.width) * 100;
            let newValue = Math.round((percentage / 100) * (max - min) + min);
            setPendingValue(newValue);

            if (!changeAfterMouseUp) {
                handleChange(newValue);
            }
        },
        [changeAfterMouseUp, dragging, max, min, handleChange]
    );

    const handleMouseUp = useCallback(() => {
        if (dragging) {
            setDragging(false);

            if (changeAfterMouseUp) {
                handleChange(pendingValue);
            }
        }
    }, [changeAfterMouseUp, dragging, handleChange, pendingValue]);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const valueStyle = {
        width: `${((pendingValue - min) / (max - min)) * 100}%`,
    };

    const thumbStyle = {
        left: `calc(${((pendingValue - min) / (max - min)) * 100}% - .5rem)`,
    };

    return (
        <div ref={rangeRef} className={style.range} onMouseDown={handleMouseDown}>
            <div className={style.value} style={valueStyle}></div>
            <div className={`${style.thumb} ${dragging ? "active" : ""}`} style={thumbStyle}></div>
        </div>
    );
};

export default Range;
