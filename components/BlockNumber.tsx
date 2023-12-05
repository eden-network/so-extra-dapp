import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"

const BlockNumber = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    return <>
        <h2 className="text-2xl mb-6">
            Block number: {' '}
            <span className="font-mono">{data?.toString()}</span>
        </h2>
        <h2 className="text-2xl mb-6">
            Recent Blocks
        </h2>
        <div className="flex flex-col max-w-xl gap-2">
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
    </>
}

export default BlockNumber