import { useState, useEffect } from "react"
import { useBlockNumber, usePublicClient } from "wagmi"
import useLogs from "../hooks/useLogs"
import BidProgress from "./BidProgress"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import useCustomChains from "../hooks/useCustomChains"
import useBlock from "../hooks/useBlock"
import { fromHex } from "viem"

const ActiveBids = () => {
    const { logs } = useLogs()
    const { l1Chain } = useCustomChains()
    const [currentBlock, setCurrentBlock] = useState(0)
    const [openBidIndex, setOpenBidIndex] = useState(null)

    const publicClient = usePublicClient({ chainId: l1Chain.id })

    const { data: blockNumber } = useBlockNumber({
        chainId: l1Chain.id,
        watch: true,
    })

    useEffect(() => {
        if (blockNumber) {
            setCurrentBlock(Number(blockNumber))
        }
    }, [blockNumber])

    useEffect(() => {
        if (publicClient) {
            const unwatch = publicClient.watchBlockNumber({
                onBlockNumber: (blockNumber) => {
                    setCurrentBlock(Number(blockNumber))
                },
            })

            return () => {
                unwatch()
            }
        }
    }, [publicClient])

    function toggleOpenBid(index) {
        setOpenBidIndex(openBidIndex === index ? null : index)
    }

    const { data, isLoading } = useBlock(blockNumber)
    if (blockNumber === undefined) {
        return <></>
    }

    const extraDataLog = data !== undefined ? fromHex(data.extraData, 'string') : undefined

    return (
        <div className="flex flex-col py-3">
            <div className="pt-2 pb-3">
                <h2 className="text-2xl text-center font-bold text-rainbow-yellow font-modelica-bold">
                    Pending Bids
                </h2>
            </div>
            <div className="px-2 my-2">
                {logs.map((log, index) => (
                    <div key={`${log.transactionHash}-${log.transactionIndex}`}>
                        {Number(log.args.blockLimit) > currentBlock ? (
                            <div className="border border-white/40 mb-2 p-2 backdrop-blur-lg">
                                <div onClick={() => toggleOpenBid(index)} className="flex justify-between items-center cursor-pointer">
                                    <p className="text-center">{log.args.extra}</p>
                                    {openBidIndex === index ? (
                                        <ChevronUpIcon className="w-6 h-6 text-white" />
                                    ) : (
                                        <ChevronDownIcon className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div className={`${openBidIndex === index ? "flex border-t border-white/40 mt-2" : "hidden"}`}>
                                    <div className="border-r border-white/50 pr-4 mt-2 flex flex-col gap-2">
                                        <p className="text-sm">ID: {log.args.id.toString()}</p>
                                        <p className="text-sm">Blocks left: {Number(log.args.blockLimit) - currentBlock}</p>
                                        <p className="text-sm">current: {currentBlock}</p>
                                    </div>
                                    <div className="flex flex-col gap-4 pl-4 my-2">
                                        Progress:
                                        <BidProgress />
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveBids