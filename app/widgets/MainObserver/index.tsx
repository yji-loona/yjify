import React, { useEffect, useRef, useState } from "react";
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
    const [scrollValue, setScrollValue] = useState(0);
    const playlistId = useSelector((state: RootState) => state.playlists.playlistId);
    const playlist = useSelector((state: RootState) => state.playlists.playlist);

    const handleScroll = (e: any) => {
        const scrollTop = e.target.scrollTop;
        setScrollValue(scrollTop);
    };

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
        <div className={style.main} onScroll={e => handleScroll(e)}>
            <div className={style.main_content}>
                <HeaderControllers scrollInit={scrollValue} />
                {playlist && <PlaylistHandler />}
            </div>
        </div>
    );
};
export default MainObserver;
