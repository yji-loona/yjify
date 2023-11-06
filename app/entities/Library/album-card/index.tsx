import { FC } from "react";
import style from "./style.module.scss";
import Image from "next/image";
import { IArtist } from "app/shared/models/interfaces";
import React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import moment from "moment";

interface IAlbumCard {
    data: SpotifyApi.SavedAlbumObject | SpotifyApi.AlbumObjectSimplified;
}

const isSavedAlbum = (
    album: SpotifyApi.SavedAlbumObject | SpotifyApi.AlbumObjectSimplified
): album is SpotifyApi.SavedAlbumObject => {
    return (album as SpotifyApi.SavedAlbumObject).added_at !== undefined;
};

const AlbumCard: FC<IAlbumCard> = ({ data }) => {
    // ? for image with a lower resolution -> worse quality
    // ? const imageObj = data.album.images.find(img => (img.width ? img.width <= 300 : img.url));

    const saved = isSavedAlbum(data);

    const imageObj = saved
        ? data.album.images.find(img => img.url)
        : data.images.find(img => img.url);

    return (
        <div className={style["album-card"]}>
            <div className={style["album-card__cover"]}>
                {imageObj?.url && (
                    <Image
                        quality={100}
                        src={imageObj?.url}
                        alt={imageObj.url}
                        width={imageObj?.width}
                        height={imageObj?.height}
                    />
                )}
            </div>
            <div className={style["album-card__info"]}>
                <div className={style["album-card__info__left"]}>
                    <p className={style["album-card__info_name"]}>
                        {saved ? data.album.name : data.name}
                    </p>
                    <p className={style["album-card__info_artists"]}>
                        {saved ? (
                            data.album.artists.length === 1 ? (
                                <button>{data.album.artists[0].name}</button>
                            ) : (
                                data.album.artists.map((artist: IArtist, i: number) => (
                                    <React.Fragment key={i}>
                                        <button>{artist.name}</button>
                                        {i < data.album.artists.length - 1 && ", "}
                                    </React.Fragment>
                                ))
                            )
                        ) : data.artists.length === 1 ? (
                            <button>{data.artists[0].name}</button>
                        ) : (
                            data.artists.map((artist: IArtist, i: number) => (
                                <React.Fragment key={i}>
                                    <button>{artist.name}</button>
                                    {i < data.artists.length - 1 && ", "}
                                </React.Fragment>
                            ))
                        )}
                    </p>
                </div>
                <HoverCard.Root openDelay={0} closeDelay={200}>
                    <HoverCard.Trigger asChild>
                        <div className={style["album-card__info__right"]}>
                            <i className="fa fa-solid fa-music" />
                        </div>
                    </HoverCard.Trigger>
                    <HoverCard.Portal>
                        <HoverCard.Content className={style.extended} sideOffset={7} side="top">
                            {saved && <p>© {data.album.label}</p>}
                            <p>
                                <span>Total tracks:</span>{" "}
                                {saved ? data.album.total_tracks : data.total_tracks}
                            </p>
                            <p>
                                <span>Release date:</span>{" "}
                                {moment(saved ? data.album.release_date : data.release_date).format(
                                    "DD.MM.YYYY"
                                )}
                            </p>
                            {saved && (
                                <p>
                                    <span>Added to the library</span>{" "}
                                    {moment(data.added_at).format("DD.MM.YYYY HH:mm")}
                                </p>
                            )}
                            <HoverCard.Arrow className={style.extended__arrow} />
                        </HoverCard.Content>
                    </HoverCard.Portal>
                </HoverCard.Root>
            </div>
        </div>
    );
};

export default AlbumCard;
