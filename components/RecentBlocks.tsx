import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"
import Onboarding from "./Onboarding"

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
            <div className="flex-1 border border-white/10 rounded-2xl w-full bg-white/5 backdrop-blur-lg">
                <Onboarding />
            </div>
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
    </div>
}

export default RecentBlocks