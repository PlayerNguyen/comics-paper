import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mangaList } from "../../../utils/mock-data";
import { classNames } from "../../../utils/common";
import { BookTrending } from "../../../components";

function ComicTrendingSection() {
    const filters = [
        {
            key: "today",
            text: "Ngày",
        },
        {
            key: "week",
            text: "Tuần",
        },
        {
            key: "all",
            text: "Tất cả",
        },
    ];
    const [activeFilter, setActiveFilter] = useState(filters[0].key);

    useEffect(() => {
        // handle filter trending
    }, [activeFilter]);

    return (
        <>
            <div className="hidden lg:block">
                <div className="gap-4 text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                    <div>
                        <span className="bg-gray-900 text-white px-2 py-1 rounded">
                            <FontAwesomeIcon
                                icon="trophy"
                                className="text-orange-400"
                            />{" "}
                            Nổi bật
                        </span>
                    </div>
                </div>
                <div className="flex bg-black p-2 rounded mt-4 grid grid-cols-3 gap-4">
                    {filters.map((_filter) => (
                        <div
                            key={_filter.key}
                            className={classNames(
                                activeFilter === _filter.key && "bg-gray-400",
                                "text-center bg-gray-800 hover:bg-gray-600 rounded p-1 font-bold text-white cursor-pointer"
                            )}
                            onClick={() => setActiveFilter(_filter.key)}
                        >
                            <span>{_filter.text}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-rows-1 divide-y">
                    {mangaList.slice(0, 6).map((_manga, _idx) => (
                        <BookTrending
                            key={_manga.id}
                            info={_manga}
                            idx={_idx}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ComicTrendingSection;