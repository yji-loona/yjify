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
import Slider from "react-slick";
import MainPageCard from "app/entities/MainPageCard/MainPageCard";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";

interface IObserver {}

const MainObserver: React.FC<IObserver> = () => {
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const [scrollValue, setScrollValue] = useState(0);
    const mainRef = useRef<any>();
    const user = useSelector((state: RootState) => state.user.user);
    const playlistId = useSelector((state: RootState) => state.playlists.playlistId);
    const playlist = useSelector((state: RootState) => state.playlists.playlist);
    const pageType = useSelector((state: RootState) => state.page.pageType);

    const [recommendContent, setRecommendContent] = useState<any>();
    const [topRecommend, setTopRecommend] = useState<any>();

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

    useEffect(() => {
        spotifyApi.getMyTopArtists({ limit: 5 }).then(
            function (data) {
                let topArtists = data.body.items;
                let topThree = topArtists.slice(0, 3);
                let artistsId = topArtists.map(artist => artist.id);
                if (artistsId && artistsId.length > 0) {
                    spotifyApi
                        .getRecommendations({
                            min_energy: 0.5,
                            seed_artists: artistsId,
                            min_popularity: 50,
                        })
                        .then(
                            function (data) {
                                let recommendations = data.body;
                                setRecommendContent(recommendations.tracks);
                            },
                            function (err) {
                                return null;
                            }
                        );
                }
                if (topThree && topThree.length > 0) {
                    let recArray: {
                        top: number;
                        id: string;
                        artist: string;
                        data: SpotifyApi.RecommendationsFromSeedsResponse;
                    }[] = [];
                    topThree.map((artist, index) => {
                        spotifyApi
                            .getRecommendations({
                                min_energy: 0.5,
                                seed_artists: [artist.id],
                                min_popularity: 50,
                            })
                            .then(function (data) {
                                let recommendations = data.body;
                                recArray.push({
                                    top: index,
                                    id: artist.id,
                                    artist: artist.name,
                                    data: recommendations,
                                });
                            });
                    });
                    setTopRecommend(recArray);
                }
            },
            function (err) {
                return null;
            }
        );
    }, [pageType]);

    // spotifyApi
    //     .getMyRecentlyPlayedTracks({
    //         limit: 20,
    //     })
    //     .then(
    //         function (data) {
    //             let contextSourcesArray = data.body.items
    //                 .filter(item => item.context)
    //                 .map(item => item.context.uri);
    //             let set = new Set(contextSourcesArray);
    //             let cleanedArray = Array.from(set);
    //             let contextsId = cleanedArray.map(item => item.split(":").pop());
    //             console.log(data.body.items);
    //         },
    //         function (err) {
    //             return null;
    //         }
    //     );

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 5,
        rows: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1450,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1140,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
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
                style={pageType === "mainPage" ? { background: "transparent" } : {}}>
                <HeaderControllers scrollInit={scrollValue} />
                {playlist && playlistId && <PlaylistHandler />}
                {pageType === "mainPage" && (
                    <div className={style.observer} ref={mainRef}>
                        {recommendContent && (
                            <>
                                <div className={style.observer__container}>
                                    <h2>Рекомендации для вас</h2>
                                    <div className={style.observer__container_slider}>
                                        <Slider {...sliderSettings}>
                                            {recommendContent.map((track: any) => (
                                                <MainPageCard
                                                    key={track.id}
                                                    title={track.name}
                                                    image={track.album.images[0].url}
                                                    artists={track.artists}
                                                />
                                            ))}
                                        </Slider>
                                    </div>
                                </div>
                                {topRecommend &&
                                    topRecommend.length > 0 &&
                                    topRecommend
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
                                                    <Slider {...sliderSettings}>
                                                        {rec.data.tracks.map((track: any) => (
                                                            <MainPageCard
                                                                key={track.id}
                                                                title={track.name}
                                                                image={track.album.images[0].url}
                                                                artists={track.artists}
                                                            />
                                                        ))}
                                                    </Slider>
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
