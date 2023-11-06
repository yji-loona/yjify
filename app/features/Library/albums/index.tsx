import style from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import useSpotify from "app/shared/hooks/useSpotify";
import { RootState } from "app/shared/store/store";
import { useSelector } from "react-redux";
import LibraryPagination from "app/features/Library/pagination";
import AlbumCard from "app/entities/Library/album-card";

const AlbumsView = () => {
    const [data, setData] = useState<SpotifyApi.SavedAlbumObject[]>();
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(4);
    const totalItems = useRef(0);
    const spotifyApi = useSpotify();
    const session = useSelector((state: RootState) => state.user);

    const handleGetLibraryData = async () => {
        if (Boolean(limit)) {
            const albums = await spotifyApi.getMySavedAlbums({ offset, limit });
            setData(albums.body.items);
            totalItems.current = albums.body.total;
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            handleGetLibraryData();
        }
    }, [session, spotifyApi, offset, limit]);
    return (
        <div className={style.albums}>
            <LibraryPagination
                page={offset}
                limit={limit}
                totalItems={totalItems.current}
                setPage={setOffset}
                setLimit={setLimit}
            />
            <div className={style.albums__grid}>
                {data?.map(album => (
                    <AlbumCard data={album} />
                ))}
            </div>
        </div>
    );
};

export default AlbumsView;
