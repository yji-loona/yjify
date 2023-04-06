import React, { useState } from "react";
import style from "./style.module.scss";

type DropdownItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

type NestedDropdownItemProps = {
    children: React.ReactNode;
};

type DropdownProps = {
    children: React.ReactNode;
};

const DropdownItem = ({ children, onClick }: DropdownItemProps) => {
    return (
        <div className={style["dropdown-item"]} onClick={onClick}>
            {children}
        </div>
    );
};

const NestedDropdownItem = ({ children }: NestedDropdownItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleItemClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={style["dropdown-item"]} onClick={handleItemClick}>
            {React.Children.toArray(children)[0]}
            {isOpen && (
                <div className={style["dropdown-nested"]}>
                    {React.Children.toArray(children).slice(1)}
                </div>
            )}
        </div>
    );
};

const Dropdown = ({ children }: DropdownProps) => {
    return (
        <div className={style.dropdown}>
            {React.Children.map(children, child => {
                if (
                    React.isValidElement(child) &&
                    child.type === DropdownItem &&
                    React.Children.count(child.props.children) > 1
                ) {
                    const nestedItems = React.Children.toArray(child.props.children).slice(1);

                    return (
                        <NestedDropdownItem>
                            {React.Children.toArray(child.props.children)[0]}
                            {nestedItems}
                        </NestedDropdownItem>
                    );
                } else if (React.isValidElement(child) && child.type === DropdownItem) {
                    return child;
                } else if (React.isValidElement(child) && child.type === "span") {
                    return <span className={style.divider}></span>;
                } else {
                    console.warn(
                        "Dropdown component only accepts 'div' elements with 'onClick' prop as children."
                    );
                    return null;
                }
            })}
        </div>
    );
};

export { Dropdown, DropdownItem, NestedDropdownItem };
