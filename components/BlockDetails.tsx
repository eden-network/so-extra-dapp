import { fromHex } from "viem"
import useBlock from "../hooks/useBlock"
import { goerli } from "viem/chains";
import TimeAgo from "react-timeago";
import { useState } from "react";
import Link from "next/link";
import Share from "./Share";
import { useRouter } from 'next/router';
import Image from "next/image";


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
                <div>
                    <p className="text-xs mb-2 text-white/70">
                        {blockHash && <span className="text-white">{ellipsis(blockHash)}</span>}
                        <span className="pl-6">Block: {blockNumber.toLocaleString()}</span>
                        {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
                    </p>
                    <p className={`${!didContentReveal && "bg-black rounded"} text-lg mb-6 font-semibold text-white`}>
                        {isLoading && `Loading...`}
                        {didContentReveal && extraData}&nbsp;
                    </p>
                </div>
                <div className="flex justify-between items-center text-xs text-white/60">
                    <div className="flex gap-2">
                        <Image src="/tx_icon.svg" width="15" height="20" alt="tx_icon" />
                        <p>TX {data !== undefined && data.transactions.length}</p>
                    </div>
                    {/* <p>BF {data !== undefined && data.baseFeePerGas !== null && formatGwei(data.baseFeePerGas).toLocaleString()}</p> */}
                    <div className="lg:flex items-center gap-2">
                        <Image src="/gasused_icon.svg" width="15" height="20" alt="tx_icon" />
                        <p>GU {data !== undefined && data.gasUsed.toLocaleString()}</p>
                    </div>

                    <Share
                        url={shareUrl}
                        blockNumber={blockNumber}
                        extraData={extraData}
                    />
                </div>
            </div>
        </div >

    return <div
        className="p-3 border border-white/30 hover:border-[#ff69f9] hover:text-[#ff69f9] w-full bg-white/5 backdrop-blur-lg relative"
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