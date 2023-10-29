import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import * as Alert from "@radix-ui/react-dialog";
import useSpotify from "app/shared/hooks/useSpotify";
import { toast } from "react-hot-toast";

interface IRemoveWrapper {
    children: ReactNode;
    isLiked: boolean;
    trackId: string;
    open: boolean;
    setOpen(value: boolean): void;
    afterEvent: () => void;
}

const RemoveFromFavouriteDilaog: FC<IRemoveWrapper> = ({
    children,
    trackId,
    isLiked,
    open,
    setOpen,
    afterEvent,
}) => {
    const spotifyApi = useSpotify();
    const handleDelete = () => {
        if (isLiked)
            spotifyApi
                .removeFromMySavedTracks([trackId])
                .then(res => {
                    if (res.statusCode === 200) {
                        toast.success("Track deleted successfully"), setOpen(false);
                        afterEvent();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    };

    return (
        <Alert.Root open={open}>
            <Alert.Trigger asChild>{children}</Alert.Trigger>
            <Alert.Portal>
                <Alert.Overlay className="overlay" />
                <Alert.Content className="dialog">
                    <Alert.Title>Delete from favorite tracks</Alert.Title>
                    <Alert.Description className="dialog__description">
                        Are you sure you want to delete a track from your favorite tracks playlist
                    </Alert.Description>
                    <div className="dialog__actions">
                        <Alert.DialogClose
                            onClick={() => setOpen(false)}
                            className="dialog__actions_cancel outline">
                            Cancel
                        </Alert.DialogClose>
                        <Alert.Close
                            onClick={handleDelete}
                            className="dialog__actions_submit outline">
                            Submit
                        </Alert.Close>
                    </div>
                </Alert.Content>
            </Alert.Portal>
        </Alert.Root>
    );
};

export default RemoveFromFavouriteDilaog;
