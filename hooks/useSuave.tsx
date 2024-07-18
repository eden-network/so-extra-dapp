import { Chain, createPublicClient, defineChain, http } from "viem"

export const toliman: Chain = defineChain({
    id: 33626250,
    name: 'Toliman',
    network: 'toliman',
    nativeCurrency: {
        name: 'Toliman ETH',
        symbol: 'tolimanETH',
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

const useSuave = (chain: Chain) => {
    const suaveClient = createPublicClient({
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0])
    })

    return {
        suaveClient, rigil
    }
}

export default useSuave