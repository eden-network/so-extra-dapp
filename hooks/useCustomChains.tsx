import { ChainFormatters } from "viem"
import { Chain, holesky, mainnet } from "viem/chains"
import { useAccount } from "wagmi"
import { toliman, rigil } from "./useSuave"

const useCustomChains = () => {
    const { chain: connected } = useAccount()

    const l1Chains: Chain<ChainFormatters | undefined>[] = [holesky, mainnet]
    const suaveChains: Chain<ChainFormatters | undefined>[] = [toliman, rigil]

    return {
        l1Chain: l1Chains[0],
        suaveChain: suaveChains[0]
    }
}

export default useCustomChains