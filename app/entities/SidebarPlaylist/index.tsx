import React, { HTMLAttributes, useEffect, useState } from "react";
import Image from "next/image";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "app/shared/store/store";
import Tooltip from "app/shared/ui/Tooltip";

interface SidebarPlaylistProps extends HTMLAttributes<HTMLDivElement> {
    playlistThumbnail?: string;
    playlistName: string;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SidebarPlaylist = ({
    onClick,
    playlistThumbnail,
    playlistName,
    ...props
}: SidebarPlaylistProps) => {
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div
            className={`${style.playlist} ${!isOpen ? style.rolled : ""}`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className={style.playlist__image}>
                {playlistThumbnail ? (
                    <Image
                        src={playlistThumbnail}
                        alt="mini thumbnail of playlist"
                        width={40}
                        height={40}
                    />
                ) : (
                    <i className="fa-solid fa-music"></i>
                )}
            </div>
            <span className={style.playlist__name}>{playlistName}</span>
            {!isOpen && <Tooltip text={playlistName} isHovered={isHovered} />}
        </div>
    );
};
export default SidebarPlaylist;
