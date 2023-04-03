import React from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import UserBoard from "app/entities/UserBoard/UserBoard";

const HeaderControllers = () => {
    return (
        <div className={style.container}>
            <div className={style.container_routings}></div>
            <div className={style.container_handler}></div>
            <div className={style.container_user}>
                <UserBoard />
            </div>
        </div>
    );
};

export default HeaderControllers;
