import { getTwitterUrl } from "@phntms/react-share";
import React from "react";
import { SocialIcon } from 'react-social-icons'

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
                className="absolute right-2 top-2 text-xs bg-transparent text-white rounded border border-[#ff69f9] px-2 py-1"
                href={getTwitterUrl({
                    url: url,
                    text: `I just build block number: ${blockNumber} and added:${extraData} `,
                    hashtags: ['extra', 'data'],
                    related: 'eden network'
                })}
            >
                {/* <SocialIcon network="twitter" fgColor="#009f7d" bgColor="#ffff" style={{ width: '40px' }} /> */}
                Share on Twitter
            </a>
        </>
    )
}

export default Share