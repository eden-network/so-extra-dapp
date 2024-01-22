import { getTwitterUrl } from "@phntms/react-share";
import React from "react";
import { SocialIcon } from 'react-social-icons'
import Image from "next/image";

const Share = ({
    url,
    blockNumber,
    extraData,

}: {
    url: string,
    blockNumber: string | bigint,
    extraData,
}) => {
    return (
        <>
            <a target="_blank"
                className="lg:flex gap-2 right-2 top-2 text-xs text-white/60 px-2 py-1"
                href={getTwitterUrl({
                    url: url,
                    text: `I just build block number: ${blockNumber} and added:${extraData} `,
                    hashtags: ['extra', 'data'],
                    related: 'eden network'
                })}
            >
                <div className="w-full flex justify-center">
                    <Image src="/share_icon.svg" width="15" height="20" alt="tx_icon" />
                </div>
                Share
            </a>
        </>
    )
}

export default Share