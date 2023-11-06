import SidebarPlaylist from "app/entities/SidebarPlaylist";
import SidebarItem from "app/entities/SidebarItem";
import SidebarNav from "app/features/SidebarNavigations";
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";
import {
    setWidth as setWidthPersisit,
    openSidebar,
    closeSidebar,
} from "app/shared/slices/sidebarSlice";
import { setPlaylistId, setUserPlaylists } from "app/shared/slices/playlistsSlice";
import SidebarPlaylists from "app/features/SidebapPlaylists";
import useSpotify from "app/shared/hooks/useSpotify";
import { setPageType } from "app/shared/slices/currentPage";
import { useRouter } from "next/router";
import { IPlaylist } from "app/shared/models/interfaces";

interface SideMenuProps {
    minWidth?: number;
    maxWidth?: number;
    defWidth: number;
}

const Sidebar: React.FC<SideMenuProps> = ({ defWidth, minWidth = 60, maxWidth = 400 }) => {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.user);
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const widthState = useSelector((state: RootState) => state.sidebar.width);
    const pageType = useSelector((state: RootState) => state.page.pageType);
    const dispatch = useDispatch();
    const spotifyApi = useSpotify();
    const [width, setWidth] = useState(defWidth);
    const [playlists, setPlaylists] = useState<any[]>([]);

    const resizer = useRef(null);
    const widthRef = useRef(defWidth);

    useEffect(() => {
        if (!isOpen && widthState > minWidth) {
            dispatch(setWidthPersisit(minWidth));
        }
        if (isOpen) {
            dispatch(setWidthPersisit(defWidth));
        }
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists({ limit: 50, offset: 0 }).then(data => {
                const resUsersPlaylists = data.body.items.filter(
                    playlist => playlist.owner.id === session.user.user.username
                );
                dispatch(setUserPlaylists(resUsersPlaylists as IPlaylist[]));
                setPlaylists(data.body.items);
            });
        }
    }, [session, spotifyApi]);

    const handleResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const startX = e.pageX;
        const startWidth = widthRef.current;

        const handleMouseMove = (event: MouseEvent) => {
            dispatch(openSidebar());
            const newWidth = startWidth + event.pageX - startX;
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                widthRef.current = newWidth;
                setWidth(newWidth);
                dispatch(setWidthPersisit(newWidth));
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            if (widthRef.current <= 140) {
                dispatch(closeSidebar());
                widthRef.current = minWidth;
                setWidth(minWidth);
                dispatch(setWidthPersisit(minWidth));
            } else {
                dispatch(openSidebar());
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    const toggleSidebar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (isOpen) {
            dispatch(closeSidebar());
            widthRef.current = minWidth;
            setWidth(minWidth);
            dispatch(setWidthPersisit(minWidth));
        } else {
            dispatch(openSidebar());
            widthRef.current = defWidth;
            setWidth(defWidth);
            dispatch(setWidthPersisit(defWidth));
        }
    };
    const PlaylistClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        e.preventDefault();
        dispatch(setPlaylistId({ playlistId: id }));
        dispatch(setPageType("playlist"));
        router.push({ query: { pageType: "playlist", playlistId: id } });
    };

    const handlePage = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        pageType: "mainPage" | "library" | "likes" | "search"
    ) => {
        e.preventDefault();
        dispatch(setPlaylistId({ playlistId: "" }));
        dispatch(setPageType(pageType));
        router.push({ query: { pageType } });
    };

    return (
        <div style={{ width: isOpen ? width : minWidth }} className={`${style.sidebar}`}>
            <SidebarNav>
                <SidebarItem
                    title="Home"
                    linkedPages={["mainPage"]}
                    onClick={e => handlePage(e, "mainPage")}>
                    <div className={style.sidebar__item}>
                        <i className="fa-solid fa-house"></i>
                    </div>
                    <span>Home</span>
                </SidebarItem>
                <SidebarItem
                    linkedPages={["search"]}
                    title="Search"
                    onClick={e => handlePage(e, "search")}>
                    <div className={style.sidebar__item}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <span>Search</span>
                </SidebarItem>
                <SidebarItem
                    linkedPages={["playlist", "library"]}
                    title="Library"
                    onClick={e => handlePage(e, "library")}>
                    <div className={style.sidebar__item}>
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <span>Library</span>
                </SidebarItem>
                <SidebarItem
                    onClick={e => handlePage(e, "likes")}
                    linkedPages={["likes"]}
                    title="My Likes">
                    <div className={style.sidebar__item}>
                        {pageType === "likes" ? (
                            <i className="fa-solid fa-heart"></i>
                        ) : (
                            <i className="fa-regular fa-heart"></i>
                        )}
                    </div>
                    <span>My Likes</span>
                </SidebarItem>
            </SidebarNav>
            <div className={style.sidebar__border}></div>
            <SidebarPlaylists>
                {playlists.map(playlist => (
                    <SidebarPlaylist
                        onClick={e => PlaylistClick(e, playlist.id)}
                        key={playlist.id}
                        playlistName={playlist.name}
                        playlistThumbnail={playlist.images.length !== 0 && playlist.images[0].url}
                    />
                ))}
            </SidebarPlaylists>
            <div
                ref={resizer}
                className={style.sidebar__resizer}
                onDoubleClick={toggleSidebar}
                onMouseDown={handleResize}
            />
        </div>
    );
};
export default Sidebar;
