import { Chain, holesky } from "viem/chains"

export const getFaucetUrl = (chain: Chain) => {
    switch (chain.id) {
        case 33626250:
            return "https://faucet.toliman.suave.flashbots.net/"
        case 16813125:
            return "https://faucet.rigil.suave.flashbots.net/"
        case holesky.id:
            return "https://cloud.google.com/application/web3/faucet/ethereum/holesky"
        default:
            return undefined
    }
}