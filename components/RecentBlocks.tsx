import { useBlockNumber } from "wagmi"
import useCustomChains from "../hooks/useCustomChains"
import BlockDetails from "./BlockDetails"

const RecentBlocks = () => {
    const { l1Chain } = useCustomChains()
    const { data } = useBlockNumber({
        chainId: l1Chain.id,
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 48 }, (_, index) => data - BigInt(index)) : []

    function getRandomInteger() {
        var randomDecimal = Math.random();
        var randomInteger = Math.floor(randomDecimal * 25);
        return randomInteger;
    }

    return <div className="flex flex-col pb-3">
        <div className="flex flex-col px-6">
            {pastBlocks.map((n, index) => <BlockDetails key={n} blockNumber={n} shareUrl="" />)}
        </div>
    </div>
}

export default RecentBlocks