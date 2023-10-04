import MainObserver from "app/widgets/MainObserver";
import Sidebar from "app/widgets/Sidebar";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";
import Head from "next/head";
import spotifyApi from "app/shared/lib/spotify";
import useSpotify from "app/shared/hooks/useSpotify";
import style from "./style.module.scss";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { userInit } from "app/shared/slices/userSlice";
import { useRouter } from "next/router";
import Player from "app/widgets/Player/Player";
import { setPageType } from "app/shared/slices/currentPage";
import { setPlaylistId } from "app/shared/slices/playlistsSlice";
import { ITrack } from "app/shared/models/interfaces";

const YjiFy = ({
    data,
}: {
    data: {
        recommendations: ITrack[];
        artistsRec: { artist: string; id: string; top: number; data: { tracks: ITrack[] } }[];
    };
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const sidebarWidth = useSelector((state: RootState) => state.sidebar.width);
    const pageTypeStore = useSelector((state: RootState) => state.page.pageType);
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign");
        }
        if (status === "authenticated" && session.user) {
            dispatch(userInit({ data: session }));
            setIsLoading(false);
            if (!!router.query.pageType) {
                const pageType = router.query.pageType as string;
                dispatch(setPageType(pageType));
                if (pageType === "playlist" && router.query.playlistId) {
                    const playlistId = router.query.playlistId as string;
                    dispatch(setPlaylistId({ playlistId }));
                }
            }
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (router.query?.pageType) {
            const pageType = router.query.pageType as string;
            if (pageTypeStore !== pageType || router.query?.playlistId) {
                dispatch(setPageType(pageType));
                if (pageType === "playlist" && router.query?.playlistId) {
                    const playlistId = router.query.playlistId as string;
                    dispatch(setPlaylistId({ playlistId }));
                }
            }
        }
    }, [router.asPath]);

    return (
        <div className={style.yjify}>
            <Head>
                <title>yji.fy</title>
                <meta name="description" content='"spotify" like app' />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            </Head>
            {isLoading ? (
                <div className={style.yjify__loader}>
                    <div className={style.yjify__loader_animation}>
                        <svg
                            version="1.1"
                            id="Layer_1"
                            x="0px"
                            y="0px"
                            width="24px"
                            height="30px"
                            viewBox="0 0 24 30">
                            <rect
                                x="0"
                                y="30"
                                width="4"
                                height="30"
                                fill="rgb(var(--main-color))"
                                opacity="0.2">
                                <animate
                                    attributeName="opacity"
                                    attributeType="XML"
                                    values="0.2; 1; .2"
                                    begin="0s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="height"
                                    attributeType="XML"
                                    values="10; 30; 10"
                                    begin="0s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="y"
                                    attributeType="XML"
                                    values="10; 0; 10"
                                    begin="0s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </rect>
                            <rect
                                x="8"
                                y="30"
                                width="4"
                                height="30"
                                fill="rgb(var(--main-color))"
                                opacity="0.2">
                                <animate
                                    attributeName="opacity"
                                    attributeType="XML"
                                    values="0.2; 1; .2"
                                    begin="0.15s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="height"
                                    attributeType="XML"
                                    values="10; 30; 10"
                                    begin="0.15s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="y"
                                    attributeType="XML"
                                    values="10; 0; 10"
                                    begin="0.15s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </rect>
                            <rect
                                x="16"
                                y="30"
                                width="4"
                                height="30"
                                fill="rgb(var(--main-color))"
                                opacity="0.2">
                                <animate
                                    attributeName="opacity"
                                    attributeType="XML"
                                    values="0.2; 1; .2"
                                    begin="0.3s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="height"
                                    attributeType="XML"
                                    values="10; 30; 10"
                                    begin="0.3s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="y"
                                    attributeType="XML"
                                    values="10; 0; 10"
                                    begin="0.3s"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </rect>
                        </svg>
                    </div>
                    <div className={style.yjify__loader_message}>
                        Checking your Spotify
                        <p className={style.dots}>
                            <span className={style.dot}></span>
                            <span className={style.dot}></span>
                            <span className={style.dot}></span>
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className={style.yjify__wrapper}>
                        <div className={style.yjify__wrapper_sidebar}>
                            <Sidebar defWidth={240} />
                        </div>
                        <div
                            style={{ width: `calc(100% - ${sidebarWidth}px)` }}
                            className={style.yjify__wrapper_center}>
                            <MainObserver />
                        </div>
                    </div>
                    <div className={style.yjify__player}>
                        <Player />
                    </div>
                </>
            )}
        </div>
    );
};

export default YjiFy;

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            props: {},
        };
    }
    const user = session.user as { accessToken?: string };
    if (user.accessToken) {
        spotifyApi.setAccessToken(user.accessToken);
    }
    //     const recArrayPromise = topArtistsPromise.then(data => {
    //         const topArtists = data.body.items;
    //         const topThree = topArtists.slice(0, 3);
    //         const artistsId = topThree.map(artist => artist.id);
    //         if (artistsId && artistsId.length > 0) {
    //             return spotifyApi
    //                 .getRecommendations({
    //                     limit: 7,
    //                     min_energy: 0.5,
    //                     seed_artists: artistsId,
    //                     min_popularity: 50,
    //                 })
    //                 .then(data => data.body.tracks)
    //                 .catch(() => null);
    //         } else {
    //             return null;
    //         }
    //     });
    //     const topThreeArtistsPromise = topArtistsPromise.then(async data => {
    //         const topArtists = data.body.items;
    //         const topThree = topArtists.slice(0, 3);
    //         const recArray: {
    //             top: number;
    //             id: string;
    //             artist: string;
    //             data: SpotifyApi.RecommendationsFromSeedsResponse;
    //         }[] = [];
    //         if (topThree && topThree.length > 0) {
    //             await Promise.all(
    //                 topThree.map(async (artist, index) => {
    //                     const req = await spotifyApi.getRecommendations({
    //                         limit: 7,
    //                         min_energy: 0.5,
    //                         min_popularity: 50,
    //                         seed_artists: [artist.id],
    //                     });
    //                     const resData = req.body;
    //                     recArray.push({
    //                         top: index,
    //                         id: artist.id,
    //                         artist: artist.name,
    //                         data: resData,
    //                     });
    //                 })
    //             );
    //         }
    //         return recArray;
    //     });

    //     const [recommendations, artistsRec] = await Promise.all([
    //         recArrayPromise,
    //         topThreeArtistsPromise,
    //     ]);
    return {
        props: {},
    };
};
