import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"

const RecentBlocks = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    function getRandomInteger() {
        var randomDecimal = Math.random();
        var randomInteger = Math.floor(randomDecimal * 41); // 41 because Math.random() can generate up to, but not including 1
        return randomInteger;
    }

    return <div className="flex flex-col pb-3">
        <div className="flex flex-col md:px-6">
            {pastBlocks.map((n, index) => <BlockDetails key={n} blockNumber={n} shareUrl="" index={getRandomInteger()} />)}
        </div>
    </div>
}

export default RecentBlocks