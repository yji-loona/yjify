import React, { useEffect, useRef } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import PlaylistHandler from "app/widgets/PlaylistHandler";

interface IObserver {}

const MainObserver: React.FC<IObserver> = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const playlistId = useSelector((state: RootState) => state.playlists.playlistId);
    const playlist = useSelector((state: RootState) => state.playlists.playlist);

    useEffect(() => {
        if (playlistId) {
            spotifyApi
                .getPlaylist(playlistId)
                .then(playlist => {
                    dispatch(getPlaylist(playlist.body));
                })
                .catch(err => console.log(err));
        }
    }, [playlistId, spotifyApi]);

    return (
        <div className={style.main}>
            <div className={style.main_header}>
                <HeaderControllers />
            </div>

            <div className={style.main_content}>{playlist && <PlaylistHandler />}</div>
        </div>
    );
};
export default MainObserver;
