import { useEffect, useState } from "react"
import { Log } from "viem"
import { EventRequestAdded, suaveContractAddress, suaveDeployBlock } from "../lib/Deployments"
import useSuave from "./useSuave"

type ArgsRequestAdded = {
    id: bigint,
    extra: string,
    blockLimit: bigint
}

export type LogRequestAdded = {
    args: ArgsRequestAdded
} & Log

const useLogs = () => {
    const [logs, setLogs] = useState<LogRequestAdded[]>([])
    const { suaveClient } = useSuave()

    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: EventRequestAdded,
            fromBlock: suaveDeployBlock,
            // toBlock: BigInt(10320182),
            strict: true
        }).then((r: LogRequestAdded[]) => {
            // console.log("event RequestAdded", r)
            setLogs(r)
        })
    }, [suaveClient])

    return {
        logs
    }
}

export default useLogs