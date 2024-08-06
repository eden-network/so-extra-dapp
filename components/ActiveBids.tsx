import { useState } from "react"
import { useBlockNumber } from "wagmi"
import useLogs from "../hooks/useLogs"
import BidProgress from "./BidProgress"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import useCustomChains from "../hooks/useCustomChains"


const ActiveBids = () => {
    const { logs } = useLogs()
    const { l1Chain } = useCustomChains()
    const { data: currentBlock } = useBlockNumber({ chainId: l1Chain.id })
    const [openBidIndex, setOpenBidIndex] = useState<number | null>(null);

    const numOfBlock = Number(currentBlock)
    function toggleOpenBid(index: number) {
        setOpenBidIndex(openBidIndex === index ? null : index);
    }

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-rainbow-yellow font-modelica-bold">
                Pending Bids
            </h2>
        </div>
        <div className="px-2 my-2">
            {logs.map((log, index) => <div key={`${log.transactionHash}-${log.transactionIndex}`}>
                {Number(log.args.blockLimit) > numOfBlock ? <div className="border border-white/40 mb-2 p-2 backdrop-blur-lg">
                    <div onClick={() => toggleOpenBid(index)} className="flex justify-between items-center cursor-pointer">
                        <p className="text-center">{log.args.extra}</p>
                        {openBidIndex === index ? <ChevronUpIcon className="w-6 h-6 text-white" /> : <ChevronDownIcon className="w-6 h-6 text-white" />}
                    </div>
                    <div className={`${openBidIndex === index ? "flex" : "hidden"} justify-between`}>
                        <div className="border-r border-white/50 pr-4">
                            <p>id: {log.args.id.toString()}</p>
                            <p>Blocks left: {Number(log.args.blockLimit) - numOfBlock}</p>
                            <p>current: {numOfBlock}</p>
                        </div>
                        <div className="flex flex-col gap-4 pl-4">
                            Progress:
                            <BidProgress />
                        </div>
                    </div>
                </div> : null}
            </div>)}
        </div>
    </div>
}

export default ActiveBids