import { useEffect, useState } from "react"
import { Block } from "viem"
import { usePublicClient } from "wagmi"

const useBlock = (blockNumber: bigint | undefined) => {
    const [block, setBlock] = useState<Block>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const publicClient = usePublicClient()

    if (blockNumber === undefined) {
        return {
            data: block,
            isLoading
        }
    }

    useEffect(() => {
        setIsLoading(true)
        publicClient.getBlock({ blockNumber })
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