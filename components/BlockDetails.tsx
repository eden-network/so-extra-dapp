import { formatGwei, fromHex, parseGwei } from "viem"
import useBlock from "../hooks/useBlock"
import { goerli } from "viem/chains";
import TimeAgo from "react-timeago";
import { useState } from "react";
import Link from "next/link";

const BlockDetails = (
    {
        blockNumber
    }: {
        blockNumber: bigint | undefined
    }
) => {
    const [ didContentReveal, setDidContentReveal ] = useState(true)
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

    return <div
        className="p-3 border border-white/10 rounded-lg hover:border-[#ff69f9] hover:text-[#ff69f9] w-full bg-white/5 backdrop-blur-lg"
        onMouseEnter={handleOnMouseEnter.bind(this)}
    >
        <Link href={`/block/${blockNumber}`}>
            <div className="flex flex-row gap-4 items-start">
                <div className="bg-green-500 w-16 h-16 rounded-md"></div>
                <div className="w-full">
                    <p className="text-sm mb-2 text-white/70">
                        {blockHash && <span>{ellipsis(blockHash)} &bull; </span>}
                        <a
                            className="underline"
                            href={href}
                            target="_blank" 
                            rel="noopener noreferrer"
                        >{blockNumber.toLocaleString()}</a>
                        {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
                    </p>
                    <p className={`${!didContentReveal && "bg-black rounded"} text-xl mb-6 font-bold text-white`}>
                        {isLoading && `Loading...`}
                        {didContentReveal && extraData}&nbsp;
                    </p>
                    <div className="flex flex-row text-sm text-white/60">
                        <p className="flex-1">TX {data !== undefined && data.transactions.length}</p>
                        <p className="flex-1">BF {data !== undefined && data.baseFeePerGas !== null && formatGwei(data.baseFeePerGas).toLocaleString()}</p>
                        <p className="flex-1">GU {data !== undefined && data.gasUsed.toLocaleString()}</p>
                        <p className="flex-2">SHARE</p>
                    </div>
                </div>
            </div>
        </Link>
    </div>
}

export default BlockDetails