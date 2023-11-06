import useSpotify from "app/shared/hooks/useSpotify";
import style from "./style.module.scss";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArtistCard from "app/entities/Library/artist-card";
import PlaylistCard from "app/entities/Library/playlist-card";
import MainPageCard from "app/entities/TrackCard/TrackCard";
import AlbumCard from "app/entities/Library/album-card";

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

const Search = () => {
    const spotifyApi = useSpotify();

    const [search, setSearch] = useState("");

    const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>();
    const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>();
    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>();

    const handleSearch = async (search: string) => {
        const albums = await spotifyApi.searchAlbums(search, { limit: 10 });
        setAlbums(albums.body.albums?.items);
        const artists = await spotifyApi.searchArtists(search, { limit: 10 });
        setArtists(artists.body.artists?.items);
        const tracks = await spotifyApi.searchTracks(search, { limit: 10 });
        setTracks(tracks.body.tracks?.items);
        const playlists = await spotifyApi.searchPlaylists(search, { limit: 10 });
        setPlaylists(playlists.body.playlists?.items);
    };

    const changeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    const clearSearch = () => {
        setSearch("");
    };
    const debounced = useDebouncedCallback(value => {
        if (Boolean(value)) handleSearch(value);
    }, 1000);

    useEffect(() => {
        debounced(search);
    }, [search]);

    console.log(albums);

    return (
        <div className={style.search}>
            <div className={style.search__field}>
                <label htmlFor="search">
                    <i className="fa fa-solid fa-magnifying-glass" />
                </label>
                <input value={search} onChange={changeSearch} type="text" id="search" />
                {Boolean(search) && (
                    <button className={style.search__field_clear} onClick={clearSearch}>
                        <i className="fa fa-solid fa-xmark" />
                    </button>
                )}
            </div>
            <div className={style.search__results}>
                {tracks && tracks.length > 0 && (
                    <div className={style.result}>
                        <h2>Tracks</h2>
                        <Swiper {...sliderSettings} className={style.result__slider}>
                            {tracks.map(track => (
                                <SwiperSlide key={track.id} className={style.result__slider_slide}>
                                    <MainPageCard
                                        title={track.name}
                                        image={track.album.images[0].url}
                                        artists={track.artists}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                {artists && artists.length > 0 && (
                    <div className={style.result}>
                        <h2>Artists</h2>
                        <Swiper {...sliderSettings} className={style.result__slider}>
                            {artists.map(artist => (
                                <SwiperSlide key={artist.id} className={style.result__slider_slide}>
                                    <ArtistCard data={artist} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                {albums && albums.length > 0 && (
                    <div className={style.result}>
                        <h2>Albums</h2>
                        <Swiper {...sliderSettings} className={style.result__slider}>
                            {albums.map(album => (
                                <SwiperSlide key={album.id} className={style.result__slider_slide}>
                                    <AlbumCard data={album} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                {playlists && playlists.length > 0 && (
                    <div className={style.result}>
                        <h2>Playlists</h2>
                        <Swiper {...sliderSettings} className={style.result__slider}>
                            {playlists.map(playlist => (
                                <SwiperSlide
                                    key={playlist.id}
                                    className={style.result__slider_slide}>
                                    <PlaylistCard data={playlist} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
