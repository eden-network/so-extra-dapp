import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"
import Onboarding from "./Onboarding"

const RecentBlocks = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    return <div className="flex flex-col pb-3">
        <div className="flex flex-col px-6 py-3 gap-1">
            <Onboarding />
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
        </div>
}

export default RecentBlocks