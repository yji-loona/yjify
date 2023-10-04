import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist } from "app/shared/slices/playlistsSlice";
import Image from "next/image";
import SongsList from "app/features/SongsList/SongsList";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";

const PlaylistHandler: React.FC = () => {
    const limit = 20;
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const { playlistId, playlist, playlistColor } = useSelector(
        (state: RootState) => state.playlists
    );
    const playlistName = useRef(null);
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState<any>([]);
    const [tracksOffset, setTrackOffset] = useState(0);
    const totalTracks = useRef(0);

    useEffect(() => {
        if (playlistId) {
            spotifyApi
                .getPlaylist(playlistId)
                .then(playlist => {
                    dispatch(getPlaylist(playlist.body));
                    setTracks(playlist.body.tracks.items);
                })
                .catch(err => console.log(err));
        }
    }, [playlistId, spotifyApi]);

    const loadMore = () => {
        if (!loading && tracks.length < totalTracks.current) {
            setLoading(true);
            setTrackOffset(prevOffset => prevOffset + limit);
        }
    };

    useEffect(() => {
        if (tracksOffset === 0) {
            setLoading(true);
        }

        spotifyApi.getPlaylistTracks(playlistId, { limit, offset: tracksOffset }).then(response => {
            const newTracks = response.body.items;
            setTracks((prevTracks: any) => [...prevTracks, ...newTracks]);
            totalTracks.current = response.body.total;
            setLoading(false);
        });
    }, [tracksOffset]);

    return (
        <div className={style.playlist}>
            <div
                className={style.playlist__header}
                style={{
                    background: `linear-gradient(180deg, rgba(${playlistColor},.8) 0%, rgba(${playlistColor},.5) 100%)`,
                }}>
                <div className={style.playlist__header_image}>
                    <div className={style.playlist__header_image__wrapper}>
                        {loading && <SvgLoader />}
                        {!loading && playlist?.images && playlist.images.length > 0 ? (
                            <Image
                                quality={50}
                                src={playlist.images[0].url}
                                alt={playlist.name + " image"}
                                onLoad={() => setLoading(false)}
                                fill
                                sizes="100%"
                            />
                        ) : null}
                    </div>
                </div>
                <div className={style.playlist__header_data}>
                    <p className={style.playlist__header_data__type}>{playlist?.type}</p>
                    <h1 ref={playlistName} className={style.playlist__header_data__name}>
                        {playlist?.name}
                    </h1>
                    <div className={style.playlist__header_data__status}>
                        {playlist?.description}
                    </div>
                    <div className={style.playlist__header_data__info}>
                        <div className={style.owner}>{playlist?.owner.display_name}</div>
                        {playlist?.followers.total ? (
                            <div className={style.counter}>
                                &nbsp;• {playlist.followers.total.toLocaleString()} likes
                            </div>
                        ) : (
                            ""
                        )}
                        <div className={style.counter}>
                            <div className={style.counter__tracks}>
                                &nbsp; • {playlist?.tracks.total.toLocaleString()} tracks
                            </div>
                            {/* <div className={style.counter__time}></div> */}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={style.playlist__songs}
                style={{
                    background: ` linear-gradient(0deg, rgba(var(--background-color),1) calc(100% - 12rem), rgba(${playlistColor},.3) 100%)`,
                }}>
                <SongsList songs={tracks} loadMore={loadMore} />
            </div>
        </div>
    );
};
export default PlaylistHandler;
