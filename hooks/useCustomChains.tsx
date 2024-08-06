// import { ChainFormatters } from "viem"
import { useAccount } from "wagmi"
import { ChainFormatters } from "@flashbots/suave-viem"
import { Chain, holesky, mainnet, suaveRigil, suaveToliman } from "@flashbots/suave-viem/chains"

const useCustomChains = () => {
    const { chain: connected } = useAccount()

    const l1Chains: Chain<ChainFormatters | undefined>[] = [holesky, mainnet]
    const suaveChains: Chain<ChainFormatters | undefined>[] = [suaveToliman, suaveRigil]

    return {
        l1Chain: l1Chains[0],
        suaveChain: suaveChains[0]
    }
}

export default useCustomChains