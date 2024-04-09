import React from "react";
import style from "./style.module.scss";
import Track from "app/entities/Track/Track";
import { Virtuoso } from "react-virtuoso";

type SongsListType = {
    songs: SpotifyApi.SavedTrackObject[];
    isFavouriteTracks?: boolean;
    loadMore?: () => void;
};

const SongsList: React.FC<SongsListType> = ({ songs, loadMore, isFavouriteTracks, ...props }) => {
    return (
        <div className={style.playlist}>
            <div className={style["inspector-unit"]}>
                <div className={style.functions}>
                    <div className={style.functions_wrap}>
                        <div className={style.functions_wrap__play}>
                            <i className="fa-solid fa-play"></i>
                        </div>
                    </div>
                    <div className={style.functions_wrap}></div>
                </div>
                <div className={style.cols}>
                    <div>#</div>
                    <div className={style.cols__active}>Название</div>
                    <div className={style.cols__active + " " + style.album}>Альбом</div>
                    <div className={style.cols__active + " " + style.date}>Дата добавления</div>
                    <div></div>
                    <div>
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <Virtuoso
                useWindowScroll
                className={style.tracks}
                style={{ height: "100%" }}
                data={songs}
                itemContent={index => {
                    const track = songs[index];
                    return (
                        <Track
                            key={index}
                            track={track}
                            order={index}
                            isFavouriteTracks={!!isFavouriteTracks}
                        />
                    );
                }}
                endReached={loadMore}
            />
        </div>
    );
};
export default SongsList;
