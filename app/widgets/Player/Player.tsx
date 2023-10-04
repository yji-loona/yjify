import MainObserver from "app/widgets/MainObserver";
import Sidebar from "app/widgets/Sidebar";
import { NextPage } from "next";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";
import Head from "next/head";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import {
    MouseEventHandler,
    TouchEvent,
    TouchEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { userInit } from "app/shared/slices/userSlice";
import { useRouter } from "next/router";
import useSpotify from "app/shared/hooks/useSpotify";
import { useTrackInfo } from "app/shared/hooks/useTrackInfo";
import React from "react";
import { ITrack } from "app/shared/models/interfaces";
import { handleTrackPlayer, setTrack } from "app/shared/slices/trackSlice";
import useDebounced from "app/shared/hooks/debounce";
import Range from "app/entities/RangeSlider/RangeSlider";
import { formatMillisToMinSec } from "app/shared/lib/time";
import Vibrant from "node-vibrant";
import { toast } from "react-hot-toast";

const Player: React.FC = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const trackId = useSelector((state: RootState) => state.track.trackId);
    const isPlaying = useSelector((state: RootState) => state.track.isTrackPlaying);
    const [firstRender, setFirstRender] = useState(true);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<"off" | "context" | "track">("off");
    const [volume, setVolume] = useState(100);
    const [playbackState, setPlaybackState] = useState<any>();
    const [dominantColor, setDominantColor] = useState<string>("");
    const [trackProgress, setTrackProgress] = useState<number>(0);
    const trackInfo: ITrack | any = useTrackInfo();

    const [isOpen, setIsOpen] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [height, setHeight] = useState(0);
    const [startY, setStartY] = useState(0);

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e: TouchEvent<Element>) => {
        setStartY((e as TouchEvent).touches[0].clientY);
        setIsMoving(true);
    };
    const handleTouchMove: TouchEventHandler<HTMLDivElement> | MouseEventHandler<HTMLDivElement> = (
        e: MouseEvent | TouchEvent<Element>
    ) => {
        let distance = 0;
        if (e.type === "touchmove") {
            distance = startY - (e as TouchEvent).touches[0].clientY;
        } else if (e.type === "mousemove") {
            distance = startY - (e as MouseEvent).clientY;
        }
        if (distance <= 0) {
            const moveHeight = Math.ceil(
                ((window.innerHeight + distance * 1.125) / window.innerHeight) * 100
            );
            if (moveHeight >= 0 && moveHeight <= 100) {
                setHeight(moveHeight);
            } else if (moveHeight < 0) {
                setHeight(0);
            } else if (moveHeight > 100) {
                setHeight(100);
            }
        }
    };

    const handleTouchEnd: TouchEventHandler<HTMLDivElement> = e => {
        e.preventDefault();
        setIsMoving(false);
        if (height < 80) {
            setIsOpen(false);
            setHeight(0);
        } else {
            setHeight(100);
        }
    };

    const handlePlayerClick = () => {
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    useEffect(() => {
        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        if (isMobile) {
            if (isOpen) {
                setHeight(100);
            } else {
                setHeight(0);
            }
        }
    }, [isOpen]);

    const handleTrackInfo = () => {
        if (!trackInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                dispatch(setTrack({ track: data.body?.item?.id || "" }));
                if (data.body) {
                    spotifyApi.getMyCurrentPlaybackState().then(data => {
                        dispatch(handleTrackPlayer(data.body?.is_playing));
                        setPlaybackState(data.body);
                        setTrackProgress(data.body?.progress_ms || 0);
                    });
                } else {
                    spotifyApi.getMyRecentlyPlayedTracks().then(tracks => {
                        const track = tracks.body.items.sort(
                            (a, b) =>
                                new Date(b.played_at).getMilliseconds() -
                                new Date(a.played_at).getMilliseconds()
                        )[0].track;
                        dispatch(setTrack({ track: track.id }));
                        setTrackProgress(0);
                    });
                }
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
                        if (error.body.error.message) toast.error(error.body.error.message);
                    });
            } else {
                spotifyApi
                    .play()
                    .then(() => {
                        dispatch(handleTrackPlayer(true));
                    })
                    .catch(error => {
                        if (error.body.error.message) toast.error(error.body.error.message);
                    });
            }
        });
    };
    const skipTrack = (dir: "prev" | "next") => {
        if (!firstRender)
            switch (dir) {
                case "prev":
                    spotifyApi
                        .skipToPrevious()
                        .then(data => {})
                        .catch(error => {
                            if (error.body.error.message) toast.error(error.body.error.message);
                        });
                    break;
                case "next":
                    spotifyApi
                        .skipToNext()
                        .then(data => {})
                        .catch(error => {
                            if (error.body.error.message) toast.error(error.body.error.message);
                        });
                    break;
            }
    };
    useEffect(() => {
        if (!firstRender)
            spotifyApi
                .setShuffle(shuffle)
                .then(data => {})
                .catch(error => {
                    if (error.body.error.message) toast.error(error.body.error.message);
                });
    }, [shuffle]);
    useEffect(() => {
        if (!firstRender)
            spotifyApi
                .setRepeat(repeat)
                .then(data => {})
                .catch(error => {
                    if (error.body.error.message) toast.error(error.body.error.message);
                });
    }, [repeat]);
    const handleRepeat = () => {
        if (!firstRender)
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
        if (!firstRender)
            spotifyApi
                .setVolume(volume)
                .then(() => {})
                .catch(error => {
                    if (error.body.error.message) toast.error(error.body.error.message);
                });
    }, 1000);

    const useProgressCallback = useDebounced(() => {
        if (!firstRender)
            spotifyApi
                .seek(trackProgress)
                .then(() => {})
                .catch(error => {
                    if (error.body.error.message) toast.error(error.body.error.message);
                });
    }, 0);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !trackId) {
            handleTrackInfo();
        }
        if (trackInfo?.album.images?.[0]?.url) {
            const src = trackInfo?.album.images?.[0]?.url;
            Vibrant.from(src)
                .getPalette()
                .then(palette => {
                    setDominantColor(palette.Vibrant?.getHex() || "");
                });
        }
    }, [trackId, trackInfo, spotifyApi, session]);
    useEffect(() => {
        if (volume >= 0 && volume <= 100) {
            useVolumeCallback();
        }
    }, [volume]);

    useEffect(() => {
        if (trackProgress >= 0) useProgressCallback();
    }, [trackProgress]);

    const handleChangeVolume = (newValue: number) => {
        setVolume(newValue);
    };
    const handleSeekTrack = (progress: number) => {
        setTrackProgress(progress);
    };

    useEffect(() => {
        setFirstRender(false);
    }, []);

    return (
        <div className={style.player} onClick={handlePlayerClick}>
            <div
                style={{
                    height: `${height}dvh`,
                    backgroundColor: dominantColor ? dominantColor : "rgb(var(--main-color))",
                    transition: isMoving ? "none" : "all .2s ease-in-out",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`${style.player__mobile_preview} ${isOpen ? style.open : ""}`}>
                <div className={style.track}>
                    <div className={style.track__header}>
                        <div
                            className={style.track__header_shut}
                            onClick={() => setIsOpen(false)}
                            onTouchEnd={() => setIsOpen(false)}>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <div className={style.track__header_dots}>
                            <i className="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                    <div className={style.track__image}>
                        {trackInfo && (
                            <Image
                                src={trackInfo?.album.images?.[0]?.url}
                                sizes="100%"
                                alt={trackInfo.name}
                                fill
                            />
                        )}
                    </div>
                    <div className={style.track__title}>
                        <div className={style.track__title_info}>
                            <p className={style.track__title_info__name}>{trackInfo?.name}</p>
                            <div className={style.track__title_info__artists}>
                                {trackInfo?.artists.length === 1 ? (
                                    <span>{trackInfo?.artists[0].name}</span>
                                ) : (
                                    trackInfo?.artists.map(
                                        (artist: { name: string }, i: number) => (
                                            <React.Fragment key={i}>
                                                <span>{artist.name}</span>
                                                {i < trackInfo?.artists.length - 1 && ", "}
                                            </React.Fragment>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                        <div className={style.track__title_like}></div>
                    </div>
                    <div className={style.track__timeline}>
                        <Range
                            value={trackProgress}
                            onChange={handleSeekTrack}
                            min={0}
                            max={trackInfo ? trackInfo.duration_ms : 0}
                            changeAfterMouseUp={true}
                        />
                        <div className={style.track__timeline_info}>
                            <span>{formatMillisToMinSec(trackProgress)}</span>
                            <span>
                                {trackInfo ? formatMillisToMinSec(trackInfo.duration_ms) : "0:00"}
                            </span>
                        </div>
                    </div>
                    <div className={style.track__features}>
                        <div
                            className={style.mix + " " + (shuffle ? style.active : "")}
                            onPointerUp={() => setShuffle(prev => !prev)}>
                            <i className="fa-solid fa-shuffle"></i>
                        </div>
                        <div className={style.back} onPointerUp={() => skipTrack("prev")}>
                            <i className="fa-solid fa-backward-step"></i>
                        </div>
                        <div className={style.play} onPointerUp={handlePlayPause}>
                            {isPlaying ? (
                                <i className="fa-solid fa-pause"></i>
                            ) : (
                                <i
                                    style={{ paddingLeft: ".2rem" }}
                                    className="fa-solid fa-play"></i>
                            )}
                        </div>
                        <div className={style.next} onPointerUp={() => skipTrack("next")}>
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
                            onPointerUp={handleRepeat}>
                            <i className="fa-solid fa-repeat"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.player__mobile}>
                <div
                    style={{
                        width: `${
                            ((trackProgress - 0) / ((trackInfo ? trackInfo.duration_ms : 0) - 0)) *
                            100
                        }%`,
                    }}
                    className={style.player__mobile_timeline}></div>
            </div>
            <div className={style.player__track}>
                <div className={style.player__track_image}>
                    {trackInfo && (
                        <Image
                            src={trackInfo?.album.images?.[0]?.url}
                            sizes="100%"
                            alt={trackInfo.name}
                            fill
                        />
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
                            <i style={{ paddingLeft: ".2rem" }} className="fa-solid fa-play"></i>
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
                        <Range
                            value={volume}
                            onChange={handleChangeVolume}
                            min={0}
                            max={100}
                            changeAfterMouseUp={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
