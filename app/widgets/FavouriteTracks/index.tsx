import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import useSpotify from "app/shared/hooks/useSpotify";
import SongsList from "app/features/SongsList/SongsList";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";
import { RootState } from "app/shared/store/store";
import { useDispatch, useSelector } from "react-redux";

const FavouriteTracks: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.user.user);
    const limit = 20;
    const spotifyApi = useSpotify();
    const [tracksOffset, setTrackOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<SpotifyApi.SavedTrackObject[]>([]);
    const totalTracks = useRef(0);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastTrack = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setLoading(true);
                setTrackOffset(prev => prev + limit);
            }
        });
        if (node) observer.current?.observe(node);
    }, []);

    useEffect(() => {
        spotifyApi.getMySavedTracks({ limit, offset: tracksOffset }).then(tracks => {
            setTracks(tracks.body.items);
            totalTracks.current = tracks.body.total;
        });
    }, []);
    useEffect(() => {
        if (tracksOffset === 0 || (tracks && tracks.length >= totalTracks.current)) {
            setLoading(false);
            return;
        }
        spotifyApi.getMySavedTracks({ limit, offset: tracksOffset }).then(tracks => {
            setTracks((prev: any) => [...prev, ...tracks.body.items]);
            setLoading(false);
        });
    }, [tracksOffset]);

    return (
        <div className={style.playlist}>
            <div className={style.playlist__header}>
                <div className={style.playlist__header_image + " "}>
                    <div className={style.playlist__header_image__wrapper + " "}>
                        <i className="fa-solid fa-heart"></i>
                    </div>
                </div>
                <div className={style.playlist__header_data}>
                    <p className={style.playlist__header_data__type}>playlist</p>
                    <h1 className={style.playlist__header_data__name}>Favourite tracks</h1>
                    <div className={style.playlist__header_data__status}>
                        {/* {playlist.description} */}
                    </div>
                    <div className={style.playlist__header_data__info}>
                        <div className={style.owner}>{user.name}</div>
                        <div className={style.counter}>
                            <div className={style.counter__tracks}>
                                &nbsp; • {totalTracks.current} tracks
                            </div>
                            <div className={style.counter__time}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.playlist__songs}>
                <SongsList songs={tracks} isFavouriteTracks={true} />
            </div>
            {tracks && tracks.length > 0 && tracks.length !== totalTracks.current && (
                <div ref={lastTrack} className={style.observer}>
                    {loading && <SvgLoader />}
                </div>
            )}
        </div>
    );
};
export default FavouriteTracks;
