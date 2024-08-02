import useCustomChains from "../hooks/useCustomChains"

const Faq = () => {
    const { l1Chain: chain } = useCustomChains()

    const RelayLink = () => {
        if (chain.id === 1) {
            return <a className="text-white underline hover:no-underline" href="https://boost-relay.flashbots.net/" target="_blank">Flashbots Relay</a>
        }

        return <a className="text-white underline hover:no-underline" href={`https://boost-relay${chain.name}.flashbots.net/`} target="_blank">Flashbots {chain.name} Relay</a>
    }

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-rainbow-yellow">
                FAQ
            </h2>
        </div>
        <div className="flex flex-col gap-4 p-3 text-sm">
            <div>
                <p className="font-semibold mb-1">
                    What does this app demonstrate?
                </p>
                <p className="mb-1">
                    This app demonstrates building blocks using Confidential Requests.
                </p>
                <p className="">
                    In this case, blocks are built using custom extra data based on an auction that takes place in SUAVE.
                </p>
            </div>
            <div>
                <p className="font-semibold mb-1">
                    How does the auction work?
                </p>
                <p className="">
                    Sealed bids are collected by the SUAPP. Bids consist of an amount, message and expiry. Each block, the winning bid is selected and attempted for inclusion in a block.
                    The block is submitted to Goerli for inclusion.
                </p>
            </div>
            <div>
                <p className="font-semibold mb-1">
                    How much should I bid?
                </p>
                <p className="">
                    In order to win, your bid has to be competive with the latest payloads delivered by <RelayLink />
                </p>
            </div>
        </div>
    </div>
}

export default Faq