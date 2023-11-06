import style from "./style.module.scss";
import { ChangeEvent, FC } from "react";
import * as Popover from "@radix-ui/react-popover";

interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    setPage(page: number): void;
    setLimit(limit: number): void;
    isCursor?: boolean;
}

const LibraryPagination: FC<IPagination> = ({
    page,
    limit,
    totalItems,
    setPage,
    setLimit,
    isCursor,
}) => {
    const handleNextPage = () => {
        setPage(page + limit);
    };

    const handlePreviousPage = () => {
        setPage(page - limit);
    };

    const handleLimit = (e: ChangeEvent<HTMLInputElement>) => {
        const limit = parseInt(e.target.value);
        if (limit <= 0) setLimit(1);
        else setLimit(limit);
    };

    return (
        <div className={style.pagination}>
            <div className={style.pagination__settings}>
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <button>
                            <i className="fa fa-solid fa-list" />
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                            className={style["pagination__settings--popover"]}
                            sideOffset={5}>
                            <div className={style["pagination__settings--popover__content"]}>
                                <p
                                    className={
                                        style["pagination__settings--popover__content-title"]
                                    }>
                                    Preview
                                </p>
                                <div
                                    className={
                                        style["pagination__settings--popover__content-fields"]
                                    }>
                                    <fieldset>
                                        <label htmlFor="limit">Limit:</label>
                                        <input
                                            id="limit"
                                            value={limit}
                                            onChange={handleLimit}
                                            type="number"
                                        />
                                    </fieldset>
                                    {isCursor && (
                                        <fieldset>
                                            <label>Total tracks: {totalItems}</label>
                                        </fieldset>
                                    )}
                                </div>
                            </div>
                            <Popover.Close
                                className={style["pagination__settings--popover__close"]}>
                                <i className="fa fa-solid fa-xmark" />
                            </Popover.Close>
                            <Popover.Arrow
                                className={style["pagination__settings--popover__arrow"]}
                            />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
            {!isCursor && (
                <div className={style.pagination__actions}>
                    <button onClick={handlePreviousPage} disabled={page === 0}>
                        <i className="fa fa-solid fa-chevron-left" />
                    </button>
                    <button onClick={handleNextPage} disabled={page + limit >= totalItems}>
                        <i className="fa fa-solid fa-chevron-right" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LibraryPagination;
