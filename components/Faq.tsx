const Faq = () => {
    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                FAQ
            </h2>
        </div>
        <div className="flex flex-col gap-4 p-3 text-sm">
            <div>
                <p className="font-semibold mb-1">
                    What does this app demonstrate?
                </p>
                <p className="mb-1">
                    This app demonstrates building Goerli blocks using Confidential Requests.
                </p>
                <p className="">
                    In this case, Goerli blocks are built using custom extra data based on an auction that takes place in SUAVE.
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
                    In order to win, your bid has to be competive with the latest payloads delivered by <a className="text-blue-500 underline" href="https://boost-relay-goerli.flashbots.net/" target="_blank">Flashbots Goerli Relay</a>
                </p>
            </div>
        </div>
    </div>
}

export default Faq