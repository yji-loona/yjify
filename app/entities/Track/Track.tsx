import React, { RefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import { formatMillisToMinSec, formatTrackDate } from "app/shared/lib/time";
import { handleTrackPlayer, setTrack } from "app/shared/slices/trackSlice";
import spotifyApi from "app/shared/lib/spotify";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";
import { toast } from "react-hot-toast";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { HeartLike } from "app/entities/HeartLike/HeartLike";
import { IArtist } from "app/shared/models/interfaces";
import { handleArtistSelect } from "app/shared/hooks/useArtistClick";
import { SvgBarsLoader } from "app/shared/ui/SvgBarsLoader/SvgBarsLoader";
import { getWindow } from "app/shared/lib/window";

interface ITrackInPlaylist {
    order: number;
    track: SpotifyApi.SavedTrackObject;
    isFavouriteTracks?: boolean;
}

const Track: React.FC<ITrackInPlaylist> = ({ order, track, isFavouriteTracks }) => {
    const dispatch = useDispatch();
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const trackId = useSelector((state: RootState) => state.track.trackId);
    const isPlaying = useSelector((state: RootState) => state.track.isTrackPlaying);
    const playlistId = useSelector((state: RootState) => state.playlists.playlistId);
    const playlists = useSelector((state: RootState) => state.playlists.userPlaylists);

    const { w } = getWindow();
    const isDesktop = w > 768;

    const isUserPlaylist = playlists?.some(item => item.id === playlistId);

    const checkIfTrackIsSaved = async (trackId: string) => {
        if (isDesktop)
            try {
                setIsLikeLoading(true);
                const result = await spotifyApi
                    .containsMySavedTracks([trackId])
                    .then(res => res.body[0]);
                setIsLiked(result);
            } finally {
                setIsLikeLoading(false);
            }
    };

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

    useEffect(() => {
        if (!isFavouriteTracks && isHovered) checkIfTrackIsSaved(track.track.id);
    }, [isHovered]);

    const handlePlaylistSelect = async (trackUri: string, playlistId: string) => {
        try {
            const res = await spotifyApi.addTracksToPlaylist(playlistId, [trackUri], {
                position: 0,
            });
            if (res.statusCode === 201) toast.success("Track successfully added to playlist");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteFromPlaylist = async (playlistId: string, trackUri: string) => {
        try {
            const res = await spotifyApi.removeTracksFromPlaylist(playlistId, [{ uri: trackUri }]);
            if (res.statusCode === 200) toast.success("Track successfully deleted from playlist");
        } catch (error) {
            console.log(error);
        }
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
                            <button onClick={() => handleArtistSelect(track.track.artists[0])}>
                                {track.track.artists[0].name}
                            </button>
                        ) : (
                            track.track.artists.map((artist: IArtist, i: number) => (
                                <React.Fragment key={i}>
                                    <button onClick={() => handleArtistSelect(artist)}>
                                        {artist.name}
                                    </button>
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
            <div className={style.track__date}>{formatTrackDate(track.added_at)}</div>
            <div className={style.track__like}>
                {isHovered &&
                    isDesktop &&
                    (isLikeLoading ? (
                        <SvgBarsLoader />
                    ) : (
                        <HeartLike
                            isLiked={!!isFavouriteTracks || isLiked}
                            trackId={track.track.id}
                            afterEvent={() => checkIfTrackIsSaved(track.track.id)}
                        />
                    ))}
            </div>
            <div className={style.track__duration}>
                {formatMillisToMinSec(track.track.duration_ms)}
            </div>
            <div className={style.track__options}>
                <Dropdown.Root>
                    <Dropdown.Trigger className="track-options__button">
                        <i className={"fa-solid fa-ellipsis " + style.features}></i>
                    </Dropdown.Trigger>
                    <Dropdown.Portal>
                        <Dropdown.Content
                            className="track-options__menu"
                            sideOffset={8}
                            side="left">
                            {!isDesktop && (
                                <Dropdown.Item className="track-options__menu_item">
                                    типа лайк на мобиле
                                </Dropdown.Item>
                            )}
                            {isUserPlaylist && (
                                <Dropdown.Item
                                    className="track-options__menu_item"
                                    onClick={() =>
                                        handleDeleteFromPlaylist(playlistId, track.track.uri)
                                    }>
                                    Delete from this playlist
                                </Dropdown.Item>
                            )}
                            <Dropdown.Sub>
                                <Dropdown.SubTrigger className="track-options__menu_item track-options__subTrigger">
                                    Add to playlist
                                    <i className="fa fa-solid fa-chevron-right" />
                                </Dropdown.SubTrigger>
                                <Dropdown.Portal>
                                    <Dropdown.SubContent className="track-options__subMenu">
                                        {playlists?.map(playlist => (
                                            <Dropdown.Item
                                                className="track-options__menu_item"
                                                key={playlist.id}
                                                onClick={() =>
                                                    handlePlaylistSelect(
                                                        track.track.uri,
                                                        playlist.id
                                                    )
                                                }>
                                                {playlist.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.SubContent>
                                </Dropdown.Portal>
                            </Dropdown.Sub>
                            <Dropdown.Sub>
                                <Dropdown.SubTrigger className="track-options__menu_item track-options__subTrigger">
                                    {track.track.artists.length > 1 ? "Artists" : "Artist"}
                                    <i className="fa fa-solid fa-chevron-right" />
                                </Dropdown.SubTrigger>
                                <Dropdown.Portal>
                                    <Dropdown.SubContent className="track-options__subMenu">
                                        {track.track.artists.map(artist => (
                                            <Dropdown.Item
                                                className="track-options__menu_item"
                                                key={artist.id}
                                                onClick={() => handleArtistSelect(artist)}>
                                                {artist.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.SubContent>
                                </Dropdown.Portal>
                            </Dropdown.Sub>
                        </Dropdown.Content>
                    </Dropdown.Portal>
                </Dropdown.Root>
            </div>
        </div>
    );
};
export default Track;
