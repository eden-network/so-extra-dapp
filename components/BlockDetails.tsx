import { fromHex } from "viem"
import useBlock from "../hooks/useBlock"
import { goerli } from "viem/chains";
import TimeAgo from "react-timeago";
import { useState } from "react";
import Link from "next/link";
import { getShareUrl, SocialPlatforms } from "@phntms/react-share";
import Share from "./Share";
import { useRouter } from 'next/router';


const BlockDetails = (
    {
        blockNumber,
        shareUrl
    }: {
        blockNumber: bigint | undefined,
        shareUrl: string
    }
) => {
    const router = useRouter();
    const isBlockPage = router.route === '/block/[blockNumber]';
    const [didContentReveal, setDidContentReveal] = useState(true)
    const handleOnMouseEnter = () => {
        setDidContentReveal(true)
    }

    const { data, isLoading } = useBlock(blockNumber)
    if (blockNumber === undefined) {
        return <></>
    }

    const href = `${goerli.blockExplorers.etherscan.url}/block/${blockNumber.toString()}`
    const blockHash = data !== undefined ? data.hash : undefined
    const blockTimestamp = data !== undefined ? new Date(parseInt(data.timestamp.toString()) * 1000) : undefined
    const extraData = data !== undefined ? fromHex(data.extraData, 'string') : undefined

    const ellipsis = (str: string) => {
        return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
    }

    const blockCard =
        <div className="flex flex-row gap-4 items-start">
            <div className="bg-green-500 w-16 h-16 rounded-md"></div>
            <div className="w-full">
                <p className="text-xs mb-2 text-white/70">
                    {blockHash && <span>{ellipsis(blockHash)}</span>}
                    {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
                </p>
                <p className={`${!didContentReveal && "bg-black rounded"} text-lg mb-6 font-semibold text-white`}>
                    {isLoading && `Loading...`}
                    {didContentReveal && extraData}&nbsp;
                </p>
                <div className="flex justify-between text-xs text-white/60">
                    <p>BN {blockNumber.toLocaleString()}</p>
                    <p>TX {data !== undefined && data.transactions.length}</p>
                    {/* <p>BF {data !== undefined && data.baseFeePerGas !== null && formatGwei(data.baseFeePerGas).toLocaleString()}</p> */}
                    <p>GU {data !== undefined && data.gasUsed.toLocaleString()}</p>
                    {isBlockPage ?
                        <Share
                            url={shareUrl}
                            blockNumber={blockNumber}
                            extraData={extraData}
                        /> : null}
                </div>
            </div>
        </div>

    return <div
        className="p-3 border border-white/10 hover:border-[#ff69f9] hover:text-[#ff69f9] w-full bg-white/5 backdrop-blur-lg relative"
        onMouseEnter={handleOnMouseEnter.bind(this)}
    >
        {
            isBlockPage ?
                blockCard
                :
                <Link href={`/block/${blockNumber}`}>
                    {blockCard}
                </Link>
        }
    </div>
}

export default BlockDetails