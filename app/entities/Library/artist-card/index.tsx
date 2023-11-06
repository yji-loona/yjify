import Image from "next/image";
import style from "./style.module.scss";
import { FC } from "react";
import { handleArtistSelect } from "app/shared/hooks/useArtistClick";

interface IArtistCard {
    data: SpotifyApi.ArtistObjectFull;
}

const ArtistCard: FC<IArtistCard> = ({ data }) => {
    const imageObj = data.images.find(img => (img.width ? img.width <= 320 : img.url));

    return (
        <button className={style.artist} onClick={() => handleArtistSelect(data)}>
            <div className={style.artist__ratio}>
                {imageObj?.url && (
                    <Image quality={100} src={imageObj?.url} alt={imageObj.url} fill />
                )}
            </div>
            <p className={style.artist__name}>{data.name}</p>
        </button>
    );
};

export default ArtistCard;
