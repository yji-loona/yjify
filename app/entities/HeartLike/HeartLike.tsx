import { Dispatch, FC, SetStateAction, useState } from "react";
import style from "./style.module.scss";
import RemoveLiked from "app/shared/ui/DelFavDialog/index";
import useSpotify from "app/shared/hooks/useSpotify";
import toast from "react-hot-toast";

interface ILike {
    isLiked: boolean;
    trackId: string;
    afterEvent: () => void;
}

export const HeartLike: FC<ILike> = ({ isLiked, trackId, afterEvent }) => {
    const spotifyApi = useSpotify();
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickLike = () => {
        if (isLiked) setOpenDelete(true);
        else
            spotifyApi
                .addToMySavedTracks([trackId])
                .then(res => {
                    if (res.statusCode) {
                        toast.success("Track successfully added");
                        afterEvent();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    };

    return (
        <RemoveLiked
            isLiked={isLiked}
            trackId={trackId}
            open={openDelete}
            setOpen={setOpenDelete}
            afterEvent={afterEvent}>
            <button
                onClick={handleClickLike}
                className={`${style.like} ${isLiked ? style.liked : ""}`}>
                {isLiked ? (
                    <i className="fa-solid fa-heart" />
                ) : (
                    <i className="fa-regular fa-heart" />
                )}
            </button>
        </RemoveLiked>
    );
};
