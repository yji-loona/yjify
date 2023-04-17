import React, { useEffect, useState } from "react";
import Image from "next/image";
import style from "./style.module.scss";
import SvgLoader from "app/shared/ui/SvgLoader/SvgLoader";

type ICard = {
    title: string;
    image?: string;
    artists?: any[];
};
const MainPageCard: React.FC<ICard> = ({ title, image = "", artists = [] }) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
    }, []);
    return (
        <div className={style.card}>
            <div className={style.card__image}>
                {loading && <SvgLoader />}
                <Image
                    src={image}
                    alt={image}
                    priority
                    fill
                    sizes="100%"
                    onLoad={() => setLoading(false)}
                />
            </div>
            <p className={style.card__title}>{title}</p>
            <p className={style.card__artists}>
                {artists.map((artist: { name: string }, i: number) => (
                    <React.Fragment key={i}>
                        <span>{artist.name}</span>
                        {i < artists.length - 1 && ", "}
                    </React.Fragment>
                ))}
            </p>
            <div className={style.card__play + " " + style.hovered}>
                <i className="fa-solid fa-play"></i>
            </div>
        </div>
    );
};

export default MainPageCard;
