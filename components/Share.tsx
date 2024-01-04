import { getTwitterUrl } from "@phntms/react-share";
import React from "react";
import Head from "next/head";

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
                href={getTwitterUrl({
                    url: url,
                    text: `I just build block number: ${blockNumber} and added:${extraData} `,
                    hashtags: ['extra', 'data'],
                    related: 'eden network'
                })}
            >
                Share to Twitter
            </a>
        </>
    )
}

export default Share