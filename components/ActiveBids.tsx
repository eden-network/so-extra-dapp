import { goerli } from "viem/chains"
import { useBlockNumber } from "wagmi"
import useLogs from "../hooks/useLogs"
import { rigil } from "../hooks/useSuave"


const ActiveBids = () => {
    const { logs } = useLogs()
    const { data: currentBlock } = useBlockNumber({ chainId: goerli.id })

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Active Bids
            </h2>
        </div>
        <div className="px-2 my-2">
            {logs.map(log => <div key={`${log.transactionHash}-${log.transactionIndex}`}>
                <p>id: {log.args.id.toString()}</p>
                <p>extra: {log.args.extra}</p>
                <p>expiry: {log.args.blockLimit.toString()}</p>
                <p>current: {currentBlock?.toString()}</p>
            </div>)}
        </div>
    </div>
}

export default ActiveBids