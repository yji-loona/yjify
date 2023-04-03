import React, { useRef, useState } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useOnClickOutsideRef from "app/shared/hooks/useOnClickOutsideRef.hooks";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";

const UserBoard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    useOnClickOutsideRef(optionsRef, () => setIsOpen(false));
    const session = useSelector((state: RootState) => state.user);
    const user = session.user.user;

    return (
        <div ref={optionsRef} className={style.user} onClick={() => setIsOpen(prev => !prev)}>
            <div className={style.user_avatar}>
                {user.image && user.image.length !== 0 ? (
                    <Image src={user.image[0].url} alt="profile image" fill />
                ) : (
                    <i className="fa-solid fa-user"></i>
                )}
            </div>
            <div className={style.user_login}>
                <span className={style.user_login__name}>{user.name}</span>
            </div>
            <div className={style.user_arrow}>
                {!isOpen ? (
                    <i className="fa-solid fa-caret-down"></i>
                ) : (
                    <i className="fa-solid fa-caret-up"></i>
                )}
            </div>
            <div className={style.user_options}>{isOpen && <div>some options...</div>}</div>
        </div>
    );
};

export default UserBoard;
