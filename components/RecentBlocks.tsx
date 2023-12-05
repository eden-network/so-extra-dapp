import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"

const RecentBlocks = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    return <div className="flex flex-col max-w-xl gap-4">
        {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
    </div>
}

export default RecentBlocks