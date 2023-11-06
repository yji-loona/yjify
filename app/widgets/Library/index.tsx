import { useState } from "react";
import style from "./style.module.scss";
import * as Tabs from "@radix-ui/react-tabs";
import AlbumsView from "app/features/Library/albums";
import ArtistsView from "app/features/Library/artists";
import PlaylistsView from "app/features/Library/playlists";

const TABS = [
    { value: "albums", label: "Albums", node: <AlbumsView /> },
    { value: "artists", label: "Artists", node: <ArtistsView /> },
    { value: "playlists", label: "Playlists", node: <PlaylistsView /> },
];

const Library = () => {
    const [tab, setTab] = useState("albums");

    return (
        <Tabs.Root value={tab} onValueChange={tab => setTab(tab)} className={style.library}>
            <Tabs.List className={style.library__tabs}>
                {TABS.map(tab => (
                    <Tabs.Trigger
                        className={style.library__tabs_tab}
                        key={tab.value}
                        value={tab.value}>
                        {tab.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            {TABS.map(tab => (
                <Tabs.Content value={tab.value} key={tab.value}>
                    {tab.node}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
};

export default Library;
