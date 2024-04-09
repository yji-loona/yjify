import style from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import useSpotify from "app/shared/hooks/useSpotify";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";
import LibraryPagination from "app/features/Library/pagination";
import ArtistCard from "app/entities/Library/artist-card";

const ArtistsView = () => {
    const [data, setData] = useState<SpotifyApi.ArtistObjectFull[]>();
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(2);
    const totalItems = useRef(0);
    const cursor = useRef<string | undefined>(undefined);
    const spotifyApi = useSpotify();
    const session = useSelector((state: RootState) => state.user);

    const handleGetLibraryData = async () => {
        if (Boolean(limit)) {
            const artists = await spotifyApi.getFollowedArtists({
                limit,
            });
            setData(artists.body.artists.items);
            totalItems.current = artists.body.artists.total ?? 0;
            cursor.current = artists.body.artists.cursors.after;
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            handleGetLibraryData();
        }
    }, [session, spotifyApi, offset, limit]);

    return (
        <div className={style.artists}>
            <LibraryPagination
                page={offset}
                limit={limit}
                totalItems={totalItems.current}
                setPage={setOffset}
                setLimit={setLimit}
                isCursor
            />
            <div className={style.artists__grid}>
                {data?.map(artist => (
                    <ArtistCard data={artist} key={artist.id} />
                ))}
            </div>
        </div>
    );
};

export default ArtistsView;
