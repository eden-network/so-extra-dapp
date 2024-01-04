import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"

const RecentBlocks = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    return <div className="flex flex-col pb-3">
        <div className="flex flex-col md:px-6 py-3">
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} shareUrl="" />)}
        </div>
    </div>
}

export default RecentBlocks