import MainObserver from "app/widgets/MainObserver";
import Sidebar from "app/widgets/Sidebar";
import { NextPage } from "next";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";
import Head from "next/head";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { userInit } from "app/shared/slices/userSlice";
import { useRouter } from "next/router";
import useSpotify from "app/shared/hooks/useSpotify";
import { useTrackInfo } from "app/shared/hooks/useTrackInfo";
import React from "react";
import { ITrack } from "app/shared/models/interfaces";
import { handleTrackPlayer, setTrack } from "app/shared/slices/trackSlice";
import useDebounced from "app/shared/hooks/debounce";

const Player: React.FC = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const trackId = useSelector((state: RootState) => state.track.trackId);
    const isPlaying = useSelector((state: RootState) => state.track.isTrackPlaying);
    const [volume, setVolume] = useState(100);

    const trackInfo: ITrack | any = useTrackInfo();

    const handleTrackInfo = () => {
        if (!trackInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playing: " + data.body?.item);
                dispatch(setTrack({ track: data.body?.item?.id || "" }));
                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    console.log(data);
                    dispatch(handleTrackPlayer(data.body?.is_playing));
                });
            });
        }
    };
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body?.is_playing) {
                spotifyApi.pause();
                dispatch(handleTrackPlayer(false));
            } else {
                spotifyApi.play();
                dispatch(handleTrackPlayer(true));
            }
        });
    };
    const handleVolume = () => {
        if (volume !== 0) {
            setVolume(0);
        } else {
            setVolume(100);
        }
    };

    const useVolumeCallback = useDebounced(() => {
        spotifyApi.setVolume(volume);
    }, 500);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !trackId) {
            handleTrackInfo();
        }
    }, [trackId, spotifyApi, session]);
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            useVolumeCallback();
        }
    }, [volume]);

    return (
        <div className={style.player}>
            <div className={style.player__track}>
                <div className={style.player__track_image}>
                    {trackInfo && (
                        <Image src={trackInfo?.album.images?.[0]?.url} sizes="100%" alt={""} fill />
                    )}
                </div>
                <div className={style.player__track_info}>
                    <div className={style.player__track_info__title}>
                        {trackInfo && trackInfo.name}
                    </div>
                    <div className={style.player__track_info__artist}>
                        {trackInfo?.artists.length === 1 ? (
                            <span>{trackInfo?.artists[0].name}</span>
                        ) : (
                            trackInfo?.artists.map(
                                (artist: { name: string }, i: React.Key | number) => (
                                    <React.Fragment key={i}>
                                        <span>{artist.name}</span>
                                        {i < trackInfo?.artists.length - 1 && ", "}
                                    </React.Fragment>
                                )
                            )
                        )}
                    </div>
                </div>
                <div className={style.player__track_like}></div>
            </div>

            <div className={style.player__rullers}>
                <div className={style.player__rullers_buttons}>
                    <div className={style.mix}>
                        <i className="fa-solid fa-shuffle"></i>
                    </div>
                    <div className={style.back}>
                        <i className="fa-solid fa-backward-step"></i>
                    </div>
                    <div className={style.play} onClick={handlePlayPause}>
                        {isPlaying ? (
                            <i className="fa-solid fa-pause"></i>
                        ) : (
                            <i className="fa-solid fa-play"></i>
                        )}
                    </div>
                    <div className={style.next}>
                        <i className="fa-solid fa-forward-step"></i>
                    </div>
                    <div className={style.repeat}>
                        <i className="fa-solid fa-repeat"></i>
                    </div>
                </div>
                <div className={style.player__rullers_timeline}>
                    <span>11:11</span>
                    <div className={style.range}></div>
                    <span>11:11</span>
                </div>
            </div>
            <div className={style.player__features}>
                <div className={style.player__features_volume}>
                    <i onClick={handleVolume} className="fa-solid fa-volume-high"></i>
                    <input
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        type="range"
                        min={0}
                        max={100}
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
