import React, { useEffect, useRef } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import Track from "app/entities/Track/Track";

const SongsList: React.FC = () => {
    const playlist = useSelector((state: RootState) => state.playlists.playlist);
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
                    <div className={style.cols__active}>Альбом</div>
                    <div className={style.cols__active}>Дата добавления</div>
                    <div></div>
                    <div>
                        <i className="fa-regular fa-clock"></i>
                    </div>
                </div>
            </div>
            <div className={style.tracks}>
                {playlist.tracks.items.map((track: any, i: number) => (
                    <Track key={i + 1 + "-" + track.track.id} track={track} order={i} />
                ))}
            </div>
        </div>
    );
};
export default SongsList;
