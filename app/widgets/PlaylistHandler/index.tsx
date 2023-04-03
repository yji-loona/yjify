import React, { useEffect, useRef } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import SongsList from "app/features/SongsList/SongsList";

const PlaylistHandler: React.FC = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const playlistId = useSelector((state: RootState) => state.playlists.playlistId);
    const playlist = useSelector((state: RootState) => state.playlists.playlist);
    const playlistName = useRef(null);

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
        <div className={style.playlist}>
            <div className={style.playlist__header}>
                <div className={style.playlist__header_image}>
                    <div className={style.playlist__header_image__wrapper}>
                        {playlist.images && playlist.images.length > 0 ? (
                            <Image
                                src={playlist.images[0].url}
                                alt={playlist.name + " image"}
                                fill
                            />
                        ) : null}
                    </div>
                </div>
                <div className={style.playlist__header_data}>
                    <p className={style.playlist__header_data__type}>{playlist.type}</p>
                    <h1 ref={playlistName} className={style.playlist__header_data__name}>
                        {playlist.name}
                    </h1>
                    <div className={style.playlist__header_data__status}>
                        {playlist.description}
                    </div>
                    <div className={style.playlist__header_data__info}>
                        <div className={style.owner}>{playlist.owner.display_name}•</div>
                        <div className={style.counter}>
                            <div className={style.counter__tracks}>
                                {playlist.tracks.total} треков,
                            </div>
                            <div className={style.counter__time}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.playlist__songs}>
                <SongsList />
            </div>
        </div>
    );
};
export default PlaylistHandler;
