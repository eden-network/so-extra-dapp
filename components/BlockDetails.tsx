import { fromHex } from "viem"
import useBlock from "../hooks/useBlock"
import { goerli } from "viem/chains";
import TimeAgo from "react-timeago";
import { useState } from "react";

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
        className="p-3 border rounded-lg hover:border-[#ff69f9] hover:text-[#ff69f9] w-full"
        onMouseEnter={handleOnMouseEnter.bind(this)}
    >
        <div className="flex flex-row gap-3 items-center">
            <div className="bg-green-500 w-14 h-14 rounded-md"></div>
            <div>
                <p className="text-sm mb-1">
                    {blockHash && <span>{ellipsis(blockHash)} &bull; </span>}
                    <a
                        className="underline"
                        href={href}
                        target="_blank" 
                        rel="noopener noreferrer"
                    >{blockNumber.toString()}</a>
                    {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
                </p>
                <p className={`${!didContentReveal && "bg-black rounded"} text-lg font-semibold`}>
                    {isLoading && `Loading...`}
                    {didContentReveal && extraData}&nbsp;
                </p>
            </div>
        </div>
    </div>
}

export default BlockDetails