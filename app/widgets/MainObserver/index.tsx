import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import HeaderControllers from "app/features/HeaderControllers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import useSpotify from "app/shared/hooks/useSpotify";
import { getPlaylist, setColor } from "app/shared/slices/playlistsSlice";
import PlaylistHandler from "app/widgets/PlaylistHandler";
import { Swiper, SwiperSlide } from "swiper/react";
// import { SwiperOptions } from "swiper/types";
import MainPageCard from "app/entities/MainPageCard/MainPageCard";
import Vibrant from "node-vibrant";
import FavouriteTracks from "app/widgets/FavouriteTracks";
import { ITrack } from "app/shared/models/interfaces";
import "swiper/css";
import { useSession } from "next-auth/react";

type Recs = {
    recommendations?: ITrack[];
    artistsRec?: { artist: string; id: string; top: number; data: { tracks: ITrack[] } }[];
};

const MainObserver: React.FC = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [scrollValue, setScrollValue] = useState(0);
    const [onesData, setOnesData] = useState<Recs>();
    const mainRef = useRef<any>();
    const { playlistId, playlist, playlistColor } = useSelector(
        (state: RootState) => state.playlists
    );
    const pageType = useSelector((state: RootState) => state.page.pageType);

    const handleScroll = (e: any) => {
        const scrollTop = e.target.scrollTop;
        setScrollValue(scrollTop);
    };

    useEffect(() => {
        (async () => {
            if (session?.user) {
                try {
                    const topArtistsPromise = await spotifyApi.getMyTopArtists({ limit: 3 });
                    console.log(topArtistsPromise);
                    if (topArtistsPromise.statusCode === 200) {
                        const artistsId = topArtistsPromise.body.items.map(artist => artist.id);

                        const recommendations = await spotifyApi.getRecommendations({
                            limit: 10,
                            min_energy: 0.5,
                            seed_artists: artistsId,
                            min_popularity: 50,
                        });

                        const artistsRec = artistsId.map(async artist => {
                            const req = await spotifyApi.getRecommendations({
                                limit: 10,
                                min_energy: 0.5,
                                min_popularity: 50,
                                seed_artists: [artist],
                            });
                        });

                        // const  Promise.allSettled(artistsRec);

                        if (recommendations.statusCode === 200) {
                            setOnesData(prev => ({
                                ...prev,
                                recommendations: recommendations.body.tracks as ITrack[],
                            }));
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        })();
    }, [session?.user]);

    useEffect(() => {
        if (playlistId) {
            spotifyApi
                .getPlaylist(playlistId)
                .then(playlist => {
                    dispatch(getPlaylist(playlist.body));
                    if (playlist?.body.images?.[0]?.url) {
                        const src = playlist?.body.images?.[0]?.url;
                        Vibrant.from(src)
                            .getPalette()
                            .then(palette => {
                                const rgbColor = palette.Vibrant?.getRgb() || null;
                                const formattedRgb = rgbColor!
                                    .map(num => Math.round(num))
                                    .join(", ");
                                dispatch(setColor(formattedRgb || ""));
                            });
                    }
                })
                .catch(err => console.log(err));
        }
    }, [playlistId, spotifyApi]);

    const sliderSettings = {
        spaceBetween: 16,
        slidesPerView: 1,
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 24 },
            960: { slidesPerView: 3, spaceBetween: 24 },
            1320: { slidesPerView: 4, spaceBetween: 32 },
            1640: { slidesPerView: 5, spaceBetween: 32 },
        },
    };

    return (
        <div className={style.main} onScroll={e => handleScroll(e)}>
            <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <div
                className={style.main_content}
                style={
                    pageType === "mainPage"
                        ? { background: "transparent" }
                        : playlistColor
                        ? {
                              backgroundImage: `linear-gradient(180deg, rgba(${playlistColor},.8) 0%, rgba(${playlistColor},.8) calc(0% + 4rem), rgba(0,0,0,0) calc(0% + 4rem))`,
                          }
                        : {}
                }>
                <HeaderControllers scrollInit={scrollValue} />
                {playlist && playlistId && <PlaylistHandler />}
                {pageType === "likes" && <FavouriteTracks />}
                {pageType === "mainPage" && (
                    <div className={style.observer} ref={mainRef}>
                        {onesData?.recommendations && (
                            <>
                                <div className={style.observer__container}>
                                    <h2>Рекомендации для вас</h2>
                                    <div className={style.observer__container_slider}>
                                        <Swiper {...sliderSettings}>
                                            {onesData.recommendations.map((track: any) => (
                                                <SwiperSlide>
                                                    <MainPageCard
                                                        key={track.id}
                                                        title={track.name}
                                                        image={track.album.images[0].url}
                                                        artists={track.artists}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                                {onesData.artistsRec &&
                                    onesData.artistsRec.length > 0 &&
                                    onesData.artistsRec
                                        .sort(
                                            (a: { top: number }, b: { top: number }) =>
                                                a.top - b.top
                                        )
                                        .map((rec: any, index: number) => (
                                            <div key={rec.id} className={style.observer__container}>
                                                <div className={style.observer__container_title}>
                                                    <h2>
                                                        Похожее на <span>{rec.artist}</span>
                                                    </h2>
                                                    <em>ваш артист №{index + 1}</em>
                                                </div>
                                                <div className={style.observer__container_slider}>
                                                    <Swiper {...sliderSettings}>
                                                        {rec.data.tracks.map((track: any) => (
                                                            <SwiperSlide>
                                                                <MainPageCard
                                                                    key={track.id}
                                                                    title={track.name}
                                                                    image={
                                                                        track.album.images[0].url
                                                                    }
                                                                    artists={track.artists}
                                                                />
                                                            </SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                </div>
                                            </div>
                                        ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainObserver;
