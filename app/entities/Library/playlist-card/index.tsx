import Image from "next/image";
import style from "./style.module.scss";
import { FC } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDispatch } from "react-redux";
import { setPlaylistId } from "app/shared/slices/playlistsSlice";
import { setPageType } from "app/shared/slices/currentPage";
import { useRouter } from "next/router";

interface IPlaylistCard {
    data: SpotifyApi.PlaylistObjectSimplified;
}

const PlaylistCard: FC<IPlaylistCard> = ({ data }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const imageObj = data.images.find(img => (img.width ? img.width <= 320 : img.url));

    const PlaylistClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault();
        dispatch(setPlaylistId({ playlistId: id }));
        dispatch(setPageType("playlist"));
        router.push({ query: { pageType: "playlist", playlistId: id } });
    };

    return (
        <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button className={style.playlist} onClick={e => PlaylistClick(e, data.id)}>
                        <div className={style.playlist__ratio}>
                            {imageObj?.url && (
                                <Image quality={100} src={imageObj?.url} alt={imageObj.url} fill />
                            )}
                        </div>
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className={style.playlist__tooltip} sideOffset={5}>
                        {data.name}
                        <Tooltip.Arrow className={style.playlist__tooltip_arrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default PlaylistCard;
