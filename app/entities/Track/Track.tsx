import React, { RefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import { formatMillisToMinSec } from "app/shared/lib/time";
import { handleTrackPlayer, setTrack } from "app/shared/slices/trackSlice";
import spotifyApi from "app/shared/lib/spotify";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";
import { toast } from "react-hot-toast";

interface ITrack {
    order: number;
    track: any;
}

const Track: React.FC<ITrack> = ({ order, track }) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const trackId = useSelector((state: RootState) => state.track.trackId);
    const isPlaying = useSelector((state: RootState) => state.track.isTrackPlaying);

    const playTrack = () => {
        if (isPlaying && trackId === track.track.id) {
            spotifyApi
                .pause()
                .then()
                .catch(error => toast.error(error?.body?.error?.message));
        } else {
            dispatch(setTrack({ track: track.track.id }));
            spotifyApi
                .play({ uris: [track.track.uri] })
                .then(() => {
                    dispatch(handleTrackPlayer(true));
                })
                .catch(error => toast.error(error?.body?.error?.message));
        }
    };
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`${style.track} ${
                trackId === track.track.id ? (isPlaying ? style.playing : style.current) : ""
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className={style.track__index}>
                {isHovered ? (
                    <button onClick={playTrack}>
                        <i
                            className={`fa-solid ${
                                isPlaying && trackId === track.track.id ? "fa-pause" : "fa-play"
                            } ${style.features}`}></i>
                    </button>
                ) : (
                    order + 1
                )}
            </div>
            <div className={style.track__name}>
                <div className={style.track__name_image}>
                    {loading && <SvgLoader />}
                    {track.track.album.images.length > 0 && (
                        <Image
                            quality={1}
                            src={track.track.album.images[0].url}
                            alt={track.track.name}
                            fill
                            sizes="100%"
                            onLoad={() => setLoading(false)}
                        />
                    )}
                </div>
                <div className={style.track__name_info}>
                    <p className={style.track__name_info__title}>{track.track.name}</p>
                    <p className={style.track__name_info__artist}>
                        {track.track.artists.length === 1 ? (
                            <span>{track.track.artists[0].name}</span>
                        ) : (
                            track.track.artists.map((artist: { name: string }, i: number) => (
                                <React.Fragment key={i}>
                                    <span>{artist.name}</span>
                                    {i < track.track.artists.length - 1 && ", "}
                                </React.Fragment>
                            ))
                        )}
                    </p>
                </div>
            </div>
            <div className={style.track__album}>
                <p>{track.track.album.name}</p>
            </div>
            <div className={style.track__date}></div>
            <div className={style.track__like}></div>
            <div className={style.track__duration}>
                {formatMillisToMinSec(track.track.duration_ms)}
            </div>
            <div className={style.track__options}>
                <i className={"fa-solid fa-ellipsis " + style.features}></i>
            </div>
        </div>
    );
};
export default Track;
