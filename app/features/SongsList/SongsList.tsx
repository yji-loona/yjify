import React, { RefObject, useEffect, useRef } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import Track from "app/entities/Track/Track";
import { Virtuoso } from "react-virtuoso";
import { useRouter } from "next/router";

type SongsListType = {
    songs?: any;
    loadMore?: () => void;
};

const SongsList: React.FC<SongsListType> = ({ songs, loadMore, ...props }) => {
    const router = useRouter();
    const playlist = useSelector((state: RootState) => state.playlists.playlist);
    const pageType = useSelector((state: RootState) => state.page.pageType);
    const virtuoso = useRef<any>(null);

    return (
        <div className={style.playlist}>
            <div className={style["inspector-unit"]}>
                <div className={style.functions}>
                    <div className={style.functions_wrap}>
                        <div className={style.functions_wrap__play}>
                            <i className="fa-solid fa-play"></i>
                        </div>
                    </div>
                    <div className={style.functions_wrap}></div>
                </div>
                <div className={style.cols}>
                    <div>#</div>
                    <div className={style.cols__active}>Название</div>
                    <div className={style.cols__active + " " + style.album}>Альбом</div>
                    <div className={style.cols__active + " " + style.date}>Дата добавления</div>
                    <div></div>
                    <div>
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <Virtuoso
                useWindowScroll
                className={style.tracks}
                style={{ height: "100%" }}
                data={songs}
                itemContent={index => {
                    const track = songs[index];
                    return <Track key={index} track={track} order={index} />;
                }}
                endReached={loadMore}
            />
        </div>
    );
};
export default SongsList;
