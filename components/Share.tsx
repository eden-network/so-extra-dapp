import { getTwitterUrl } from "@phntms/react-share";
import React from "react";
import ShareModal from "./Modal/ShareModal";
import { useState } from "react";
import { ShareIcon } from "@heroicons/react/24/solid";

const Share = ({
    url,
    blockNumber,
    extraData,
}: {
    url: string,
    blockNumber: string | bigint,
    extraData,
}) => {

    const [showShareModal, setShowShareModal] = useState<boolean>(false);

    function toggleShareModal() {
        setShowShareModal(!showShareModal);
    }

    return (
        <>
            <div className="group">
                <a target="_blank"
                    className="lg:flex gap-2 right-2 top-2 text-xs text-white/60 px-2 py-1 group-hover:text-fuchsia-500"
                    href={getTwitterUrl({
                        url: url,
                        text: `I just build block ${blockNumber} with extra data:\n\n${extraData}\n\n`,
                        hashtags: ['extra', 'data'],
                        related: 'eden network'
                    })}
                >
                    <div className="w-full flex justify-center">
                        <ShareIcon width={15} height={15}></ShareIcon>
                    </div>
                    Share
                </a>
            </div>
            <ShareModal showModal={showShareModal} toggleModal={toggleShareModal} />
        </>
    )
}

export default Share