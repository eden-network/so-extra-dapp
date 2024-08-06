import { fromHex } from "viem"
import useBlock from "../hooks/useBlock"
import TimeAgo from "react-timeago";
import { useState } from "react";
import Link from "next/link";
import Share from "./Share";
import { useRouter } from 'next/router';
import Image from "next/image";
import ShareModal from "./Modal/ShareModal";
import ellipsis from "../lib/ellipsis";

const BlockDetails = (
    {
        blockNumber,
        shareUrl,
        index
    }: {
        blockNumber: bigint | undefined,
        shareUrl: string,
        index: number
    }
) => {
    const router = useRouter();
    const isBlockPage = router.route === '/block/[blockNumber]';
    const [didContentReveal, setDidContentReveal] = useState(true)
    const handleOnMouseEnter = () => {
        setDidContentReveal(true)
    }
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const { data, isLoading } = useBlock(blockNumber)
    if (blockNumber === undefined) {
        return <></>
    }

    const blockHash = data !== undefined ? data.hash : undefined
    const blockTimestamp = data !== undefined ? new Date(parseInt(data.timestamp.toString()) * 1000) : undefined
    const extraData = data !== undefined ? fromHex(data.extraData, 'string') : undefined

    function toggleShareModal() {
        setShowShareModal(!showShareModal);
    }

    const blockCard =
        <div className="flex flex-row gap-4 items-start">
            <div className="flex m-auto">
                <Image src={`/blockdetails/${index}.png`} width={100} height={50} alt="blockdetails_symbol" />
            </div>
            <div className="w-full flex flex-col justify-between gap-6">
                <div>
                    <p className="text-xs text-white/70">
                        {blockHash && <span className="text-white">{ellipsis(blockHash)}</span>}
                        <span className="pl-6">Block: {blockNumber.toLocaleString()}</span>
                        {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
                    </p>
                </div>
                <div>
                    <p className={`${!didContentReveal && "bg-black rounded"} text-lg font-semibold text-white`}>
                        {isLoading && `Loading...`}
                        {didContentReveal && extraData}&nbsp;
                    </p>
                </div>
                <div className="flex justify-start gap-14 items-center text-xs text-white/60">
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