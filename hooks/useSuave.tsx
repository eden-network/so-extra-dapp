import { Chain, createPublicClient, defineChain, http } from "viem"

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

const useSuave = () => {
    const suaveTransport = http('https://rpc.rigil.suave.flashbots.net')
    const suaveClient = createPublicClient({
        chain: rigil,
        transport: suaveTransport
    })

    return {
        suaveClient, rigil
    }
}

export default useSuave