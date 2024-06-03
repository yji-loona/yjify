import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import UserBoard from "app/entities/UserBoard/UserBoard";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface IHeader {
    scrollInit: number;
}

const HeaderControllers: React.FC<IHeader> = ({ scrollInit }) => {
    const router = useRouter();
    const [showExtraItems, setShowExtraItems] = useState(false);
    const [showHeaderInfo, setShowHeaderInfo] = useState(false);
    const [scrolledOver, setScrolledOver] = useState(false);
    const [opacity, setOpacity] = useState(0.0);
    const pageType = useSelector((state: RootState) => state.page.pageType);
    const { playlist, playlistColor } = useSelector((state: RootState) => state.playlists);

    useEffect(() => {
        if (
            (pageType === "playlist" && scrollInit >= 250) ||
            pageType === "mainPage" ||
            pageType === "likes"
        ) {
            setScrolledOver(true);
            if ((scrollInit - 100) / 100 <= 1 || (scrollInit - 100) / 100 >= 0.0) {
                if (pageType === "playlist" || pageType === "likes")
                    setOpacity((scrollInit - 200) / 100);
                if (pageType === "mainPage") setOpacity(scrollInit / 80);
            }
        } else setScrolledOver(false);

        if (pageType !== "mainPage" && scrollInit >= 330 && !showHeaderInfo)
            setShowHeaderInfo(true);
        else if (scrollInit < 330 && showHeaderInfo) setShowHeaderInfo(false);

        if (
            (pageType === "likes" || pageType === "playlist") &&
            scrollInit >= 370 &&
            !showExtraItems
        )
            setShowExtraItems(true);
        if (
            (pageType === "likes" || pageType === "playlist") &&
            scrollInit - 60 < 340 &&
            showExtraItems
        )
            setShowExtraItems(false);
    }, [scrollInit, playlist, pageType]);
    return (
        <div className={style.sticky}>
            <div
                className={style.container}
                style={
                    scrolledOver
                        ? playlistColor
                            ? { backgroundColor: `rgba(${playlistColor},${opacity})` }
                            : { backgroundColor: `rgba(var(--main-color),${opacity})` }
                        : {}
                }>
                <div className={style.container_routings}>
                    <button
                        className={style.container_routings__back}
                        onClick={() => router.back()}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        className={style.container_routings__next}
                        onClick={() => router.forward()}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <div className={style.container_handler}>
                    {showHeaderInfo && (
                        <div className={style.container_handler__title}>
                            {pageType === "playlist"
                                ? playlist?.name
                                : pageType === "likes"
                                ? "Favourite tracks"
                                : ""}
                        </div>
                    )}
                </div>
                <div className={style.container_user}>
                    <UserBoard />
                </div>
            </div>
            {showExtraItems && (pageType === "playlist" || pageType === "likes") && (
                <div className={style["inspector-unit"]}>
                    <div className={style.cols}>
                        <div>#</div>
                        <div className={style.cols__active}>Название</div>
                        <div className={style.cols__active + " " + style.album}>Альбом</div>
                        <div className={style.cols__active + " " + style.date}>Дата добавления</div>
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
