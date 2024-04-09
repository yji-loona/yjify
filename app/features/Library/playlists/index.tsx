import style from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import useSpotify from "app/shared/hooks/useSpotify";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";
import LibraryPagination from "app/features/Library/pagination";
import PlaylistCard from "app/entities/Library/playlist-card";

const PlaylistsView = () => {
    const [data, setData] = useState<SpotifyApi.PlaylistObjectSimplified[]>();
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const totalItems = useRef(0);
    const spotifyApi = useSpotify();
    const session = useSelector((state: RootState) => state.user);

    const handleGetLibraryData = async () => {
        if (Boolean(limit)) {
            const artists = await spotifyApi.getUserPlaylists({ limit, offset });
            setData(artists.body.items);
            totalItems.current = artists.body.total ?? 0;
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            handleGetLibraryData();
        }
    }, [session, spotifyApi, offset, limit]);

    return (
        <div className={style.playlists}>
            <LibraryPagination
                page={offset}
                limit={limit}
                totalItems={totalItems.current}
                setPage={setOffset}
                setLimit={setLimit}
            />
            <div className={style.playlists__grid}>
                {data?.map(playlist => (
                    <PlaylistCard data={playlist} key={playlist.id} />
                ))}
            </div>
        </div>
    );
};

export default PlaylistsView;
