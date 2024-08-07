import useBurnerWallet from "./useBurnerWallet"
import { http, HttpTransport } from '@flashbots/suave-viem';
import { getSuaveProvider, getSuaveWallet, type SuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { useEffect, useState } from "react";
import { Chain, suaveToliman, suaveRigil } from "@flashbots/suave-viem/chains";

export const toliman = suaveToliman
export const rigil = suaveRigil

const useSuave = (chain: Chain = toliman) => {
    const rpcUrl = chain.rpcUrls.public.http[0]
    const suaveProvider = getSuaveProvider(
        http(rpcUrl)
    )
    const { privateKey } = useBurnerWallet()
    const [suaveBurnerWallet, setSuaveBurnerWallet] = useState<SuaveWallet<HttpTransport>>()

    useEffect(() => {
        if (privateKey === undefined) {
            setSuaveBurnerWallet(undefined)
            return
        }
        const newBurnerWallet = getSuaveWallet({
            transport: http(rpcUrl),
            privateKey: privateKey
        })
        setSuaveBurnerWallet(newBurnerWallet)
    }, [
        privateKey,
        rpcUrl
    ])

    return {
        connectedSuaveChain: chain,
        suaveBurnerWallet,
        suaveProvider
    }
}

export default useSuave