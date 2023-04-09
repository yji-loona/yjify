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
import { handlingToast } from "app/shared/hooks/handlingToast";
import Range from "app/entities/RangeSlider/RangeSlider";
import { formatMillisToMinSec } from "app/shared/lib/time";

const Player: React.FC = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const trackId = useSelector((state: RootState) => state.track.trackId);
    const isPlaying = useSelector((state: RootState) => state.track.isTrackPlaying);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<"off" | "context" | "track">("off");
    const [volume, setVolume] = useState(100);
    const [playbackState, setPlaybackState] = useState<any>();
    const [trackProgress, setTrackProgress] = useState<number>(0);
    const trackInfo: ITrack | any = useTrackInfo();

    const handleTrackInfo = () => {
        if (!trackInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                dispatch(setTrack({ track: data.body?.item?.id || "" }));
                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    dispatch(handleTrackPlayer(data.body?.is_playing));
                    setPlaybackState(data.body);
                    setTrackProgress(data.body?.progress_ms || 0);
                });
            });
        }
    };
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body?.is_playing) {
                spotifyApi
                    .pause()
                    .then(() => {
                        dispatch(handleTrackPlayer(false));
                    })
                    .catch(error => {
                        if (
                            error.body.error.reason === "PREMIUM_REQUIRED" &&
                            error.body.error.status === 403
                        ) {
                            handlingToast(
                                dispatch,
                                "your account must be Premium for Pause track",
                                "error"
                            );
                        }
                    });
            } else {
                spotifyApi
                    .play()
                    .then(() => {
                        dispatch(handleTrackPlayer(true));
                    })
                    .catch(error => {
                        if (
                            error.body.error.reason === "PREMIUM_REQUIRED" &&
                            error.body.error.status === 403
                        ) {
                            handlingToast(
                                dispatch,
                                "your account must be Premium for Play track",
                                "error"
                            );
                        }
                    });
            }
        });
    };
    const skipTrack = (dir: "prev" | "next") => {
        switch (dir) {
            case "prev":
                spotifyApi
                    .skipToPrevious()
                    .then(data => {})
                    .catch(error => {
                        if (
                            error.body.error.reason === "PREMIUM_REQUIRED" &&
                            error.body.error.status === 403
                        ) {
                            handlingToast(
                                dispatch,
                                "your account must be Premium for Play previous track",
                                "error"
                            );
                        }
                    });
                break;
            case "next":
                spotifyApi
                    .skipToNext()
                    .then(data => {})
                    .catch(error => {
                        if (
                            error.body.error.reason === "PREMIUM_REQUIRED" &&
                            error.body.error.status === 403
                        ) {
                            handlingToast(
                                dispatch,
                                "your account must be Premium for Play next track",
                                "error"
                            );
                        }
                    });
                break;
        }
    };
    useEffect(() => {
        spotifyApi
            .setShuffle(shuffle)
            .then(data => {})
            .catch(error => {
                if (
                    error.body.error.reason === "PREMIUM_REQUIRED" &&
                    error.body.error.status === 403
                ) {
                    handlingToast(
                        dispatch,
                        "your account must be Premium for Shuffle queue",
                        "error"
                    );
                }
            });
    }, [shuffle]);
    useEffect(() => {
        spotifyApi
            .setRepeat(repeat)
            .then(data => {})
            .catch(error => {
                if (
                    error.body.error.reason === "PREMIUM_REQUIRED" &&
                    error.body.error.status === 403
                ) {
                    handlingToast(
                        dispatch,
                        "your account must be Premium for Repeating traks",
                        "error"
                    );
                }
            });
    }, [repeat]);
    const handleRepeat = () => {
        switch (repeat) {
            case "off":
                setRepeat("context");
                break;
            case "context":
                setRepeat("track");
                break;
            case "track":
                setRepeat("off");
                break;
        }
    };

    const handleVolume = () => {
        if (volume !== 0) {
            setVolume(0);
        } else {
            setVolume(100);
        }
    };

    const useVolumeCallback = useDebounced(() => {
        spotifyApi
            .setVolume(volume)
            .then(() => {})
            .catch(error => {
                if (
                    error.body.error.reason === "PREMIUM_REQUIRED" &&
                    error.body.error.status === 403
                ) {
                    handlingToast(
                        dispatch,
                        "your account must be Premium for Change volume",
                        "error"
                    );
                }
            });
    }, 1000);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !trackId) {
            handleTrackInfo();
        }
    }, [trackId, spotifyApi, session]);
    useEffect(() => {
        if (volume >= 0 && volume <= 100) {
            useVolumeCallback();
        }
    }, [volume]);

    const handleChangeVolume = (newValue: number) => {
        setVolume(newValue);
    };
    const handleSeekTrack = (progress: number) => {
        setTrackProgress(progress);
    };
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
                            trackInfo?.artists.map((artist: { name: string }, i: number) => (
                                <React.Fragment key={i}>
                                    <span>{artist.name}</span>
                                    {i < trackInfo?.artists.length - 1 && ", "}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </div>
                <div className={style.player__track_like}></div>
            </div>

            <div className={style.player__rullers}>
                <div className={style.player__rullers_buttons}>
                    <div
                        className={style.mix + " " + (shuffle ? style.active : "")}
                        onClick={() => setShuffle(prev => !prev)}>
                        <i className="fa-solid fa-shuffle"></i>
                    </div>
                    <div className={style.back} onClick={() => skipTrack("prev")}>
                        <i className="fa-solid fa-backward-step"></i>
                    </div>
                    <div className={style.play} onClick={handlePlayPause}>
                        {isPlaying ? (
                            <i className="fa-solid fa-pause"></i>
                        ) : (
                            <i className="fa-solid fa-play"></i>
                        )}
                    </div>
                    <div className={style.next} onClick={() => skipTrack("next")}>
                        <i className="fa-solid fa-forward-step"></i>
                    </div>
                    <div
                        className={
                            style.repeat +
                            " " +
                            (repeat === "context" ? style.active : "") +
                            " " +
                            (repeat === "track" ? style.active_solo : "")
                        }
                        onClick={handleRepeat}>
                        <i className="fa-solid fa-repeat"></i>
                    </div>
                </div>
                <div className={style.player__rullers_timeline}>
                    <span>{formatMillisToMinSec(trackProgress)}</span>
                    <div className={style.range}>
                        <Range
                            value={trackProgress}
                            onChange={handleSeekTrack}
                            min={0}
                            max={trackInfo ? trackInfo.duration_ms : 0}
                            changeAfterMouseUp={true}
                        />
                    </div>
                    <span>{trackInfo ? formatMillisToMinSec(trackInfo.duration_ms) : "0:00"}</span>
                </div>
            </div>
            <div className={style.player__features}>
                <div className={style.player__features_volume}>
                    <i onClick={handleVolume} className="fa-solid fa-volume-high"></i>
                    <div className={style.volume}>
                        <Range value={volume} onChange={handleChangeVolume} min={0} max={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
