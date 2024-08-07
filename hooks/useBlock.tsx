import { useEffect, useState } from "react"
import { Block } from "viem"
import { usePublicClient } from "wagmi"
import useCustomChains from "./useCustomChains"

const useBlock = (blockNumber: bigint | undefined) => {
    const [block, setBlock] = useState<Block>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { l1Chain } = useCustomChains()
    const publicClient = usePublicClient({ chainId: l1Chain.id })

    useEffect(() => {
        setIsLoading(true)
        publicClient?.getBlock({ blockNumber })
            .then((x: Block) => {
                setBlock(x)
                setIsLoading(false)
            })
            .catch((e: Error) => {
                console.log(e)
                setIsLoading(false)
            })
    }, [publicClient, blockNumber])

    return {
        data: block,
        isLoading
    }

}

export default useBlock