import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import UserBoard from "app/entities/UserBoard/UserBoard";

interface IHeader {
    scrollInit: number;
}

const HeaderControllers: React.FC<IHeader> = ({ scrollInit }) => {
    const [showExtraItems, setShowExtraItems] = useState(false);
    const [showHeaderInfo, setShowHeaderInfo] = useState(false);
    const [scrolledOver, setScrolledOver] = useState(false);
    const [opacity, setOpacity] = useState(0.0);

    useEffect(() => {
        if (scrollInit >= 250) {
            setScrolledOver(true);
            if ((scrollInit - 100) / 100 <= 1 || (scrollInit - 100) / 100 >= 0.0) {
                setOpacity((scrollInit - 260) / 100);
            }
        } else {
            setScrolledOver(false);
        }
        if (scrollInit >= 390 && !showHeaderInfo) {
            setShowHeaderInfo(true);
        } else if (scrollInit < 390 && showHeaderInfo) {
            setShowHeaderInfo(false);
        }
        console.log(Math.ceil(scrollInit));

        if (scrollInit >= 425 && !showExtraItems) {
            setShowExtraItems(true);
        }
        if (scrollInit - 60 < 400 && showExtraItems) {
            setShowExtraItems(false);
        }
        // if (scrollInit < 425 && showExtraItems) {
        //     setShowExtraItems(false);
        // }
    }, [scrollInit]);

    return (
        <div className={style.sticky}>
            <div
                className={style.container}
                style={scrolledOver ? { backgroundColor: `rgba(100,0,255,${opacity})` } : {}}>
                <div className={style.container_routings}>
                    <div className={style.container_routings__back}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </div>
                    <div className={style.container_routings__next}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
                <div className={style.container_handler}>
                    {showHeaderInfo && (
                        <>
                            <div className={style.container_handler__play}>
                                <i className="fa-solid fa-play"></i>
                            </div>
                            <div className={style.container_handler__title}>test</div>
                        </>
                    )}
                </div>
                <div className={style.container_user}>
                    <UserBoard />
                </div>
            </div>
            {showExtraItems && (
                <div className={style["inspector-unit"]}>
                    <div className={style.cols}>
                        <div>#</div>
                        <div className={style.cols__active}>Название</div>
                        <div className={style.cols__active}>Альбом</div>
                        <div className={style.cols__active}>Дата добавления</div>
                        <div></div>
                        <div>
                            <i className="fa-regular fa-clock"></i>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderControllers;
