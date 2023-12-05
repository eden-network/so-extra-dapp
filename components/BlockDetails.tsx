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
    const [ didContentReveal, setDidContentReveal ] = useState(false)
    const handleOnMouseEnter = () => {
        setDidContentReveal(true)
    }

    const { data, isLoading } = useBlock(blockNumber)
    if (blockNumber === undefined) {
        return <></>
    }

    const href = `${goerli.blockExplorers.etherscan.url}/block/${blockNumber.toString()}`
    const blockTimestamp = data !== undefined ? new Date(parseInt(data.timestamp.toString()) * 1000) : undefined
    const extraData = data !== undefined ? fromHex(data.extraData, 'string') : undefined

    return <div
        className="p-4 border founded hover:text-[#ff69f9] w-full"
        onMouseEnter={handleOnMouseEnter.bind(this)}
    >
        <p className="text-xs">
            <a
                className="underline"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >{blockNumber.toString()}</a>
            {blockTimestamp && (<span> &bull; <TimeAgo date={blockTimestamp} /></span>)}
        </p>
        {isLoading ? <>
            <p>Loading...</p>
        </> : <>
            <p className={`${!didContentReveal && "bg-black"} rounded`}>
                &nbsp;{extraData}
            </p>
        </>}
    </div >
}

export default BlockDetails