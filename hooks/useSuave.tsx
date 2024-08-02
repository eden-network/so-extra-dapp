import { Chain, createPublicClient, defineChain, http, HttpTransport } from "viem"
import useBurnerWallet from "./useBurnerWallet"
import { http as httpSuaveViem } from '@flashbots/suave-viem';
import { getSuaveProvider, getSuaveWallet, type SuaveWallet } from '@flashbots/suave-viem/chains/utils';
import { useEffect, useState } from "react";

export const toliman: Chain = defineChain({
    id: 33626250,
    name: 'Toliman',
    network: 'toliman',
    nativeCurrency: {
        name: 'Toliman ETH',
        symbol: 'tETH',
        decimals: 18
    },
    rpcUrls: {
        'default': {
            http: ['https://rpc.toliman.suave.flashbots.net'],
        },
        public: {
            http: ['https://rpc.toliman.suave.flashbots.net'],
        }
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://explorer.toliman.suave.flashbots.net/'
        },
    },
})

export const rigil: Chain = defineChain({
    id: 16813125,
    name: 'Rigil',
    network: 'rigil',
    nativeCurrency: {
        name: 'Rigil ETH',
        symbol: 'rigilETH',
        decimals: 18
    },
    rpcUrls: {
        'default': {
            http: ['https://rpc.rigil.suave.flashbots.net'],
        },
        public: {
            http: ['https://rpc.rigil.suave.flashbots.net'],
        }
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://explorer.rigil.suave.flashbots.net/'
        },
    },
})

const useSuave = (chain: Chain = toliman) => {
    const suaveClient = createPublicClient({
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0])
    })

    const suaveProvider = getSuaveProvider(
        httpSuaveViem(chain.rpcUrls.default.http[0])
    )

    const { privateKey } = useBurnerWallet()

    const [suaveBurnerWallet, setSuaveBurnerWallet] = useState<SuaveWallet<Transport> | undefined>(undefined)

    useEffect(() => {
        if (privateKey === undefined) {
            setSuaveBurnerWallet(undefined)
            return
        }
        const newBurnerWallet = getSuaveWallet({
            transport: httpSuaveViem(chain.rpcUrls.default.http[0]),
            privateKey: privateKey
        })
        setSuaveBurnerWallet(newBurnerWallet)
    }, [
        privateKey
    ])

    return {
        suaveClient, 
        connectedSuaveChain: chain, 
        suaveBurnerWallet,
        suaveProvider
    }
}

export default useSuave