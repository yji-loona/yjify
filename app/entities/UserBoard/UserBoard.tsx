import React, { useRef, useState } from "react";
import style from "./style.module.scss";
import { signOut } from "next-auth/react";
import Image from "next/image";
import useOnClickOutsideRef from "app/shared/hooks/useOnClickOutsideRef.hooks";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";
import {
    Dropdown,
    DropdownItem,
    NestedDropdownItem,
} from "app/shared/ui/DropdownFeatures/Dropdown";
import ThemeToggle from "app/shared/ui/ThemeToggle/ThemeToggle";

const UserBoard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    useOnClickOutsideRef(optionsRef, () => setIsOpen(false));
    const session = useSelector((state: RootState) => state.user);
    const user = session.user.user;

    return (
        <div ref={optionsRef} className={style.wrapper}>
            <div
                className={style.wrapper__user + " " + (isOpen ? style.hover : "")}
                onClick={() => setIsOpen(prev => !prev)}>
                <div className={style.wrapper__user_avatar}>
                    {user.image && user.image.length !== 0 ? (
                        <Image src={user.image[0].url} alt="profile image" fill />
                    ) : (
                        <i className="fa-solid fa-user"></i>
                    )}
                </div>
                <div className={style.wrapper__user_login}>
                    <span className={style.wrapper__user_login__name}>{user.name}</span>
                </div>
                <div className={style.wrapper__user_arrow}>
                    {!isOpen ? (
                        <i className="fa-solid fa-caret-down"></i>
                    ) : (
                        <i className="fa-solid fa-caret-up"></i>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className={style.wrapper__options}>
                    <Dropdown>
                        <DropdownItem>
                            <div className="wrap">
                                Theme
                                <div style={{ width: "60px" }}>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </DropdownItem>
                        <DropdownItem>
                            <div>test</div>
                            <div>test 2</div>
                        </DropdownItem>
                        <span></span>
                        <DropdownItem>
                            <div onClick={() => signOut()}>
                                Log out<i className="fa-solid fa-right-from-bracket"></i>
                            </div>
                        </DropdownItem>
                    </Dropdown>
                </div>
            )}
        </div>
    );
};

export default UserBoard;
