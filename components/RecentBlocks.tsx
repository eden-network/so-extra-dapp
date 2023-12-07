import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"

const RecentBlocks = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    return <div className="flex flex-col pb-3">
        {/* <div className="border-b pt-2 pb-3">
            <h2 className="text-2xl text-center font-semibold">
                Timeline
            </h2>
        </div> */}
        <div className="flex flex-col px-6 py-3 gap-1">
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
    </div>
}

export default RecentBlocks