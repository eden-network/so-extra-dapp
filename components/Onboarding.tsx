import { useState } from "react"

const Onboarding = () => {
    const [displayOnboarding, setDisplayOnboarding] = useState<boolean>(true)

    return displayOnboarding ? (
        <div className="flex-1 w-full">
            <div className="flex flex-col pb-3">
                <div className="flex flex-row justify-end">
                    <button className="underline italic hover:no-underline text-sm" onClick={() => setDisplayOnboarding(false)}>Close section</button>
                </div>
                <div className="p-3">
                    <h2 className="text-2xl text-center font-bold text-rainbow-yellow">
                        Welcome to the show!
                    </h2>
                </div>
                <div className="flex flex-col gap-2 p-3 text-sm">
                    <p className="text-sm">
                        In this demo, you will use testnet SUAVE to buy block extra data on testnet Ethereum.
                    </p>
                    <p className="text-sm">
                        Before you start, there are a few prequisites.
                    </p>
                    <p className="text-sm">
                        You need:
                    </p>
                    <ol className="list-decimal list-inside ml-3">
                        <li>Goerli ETH: <a href="https://goerli-faucet.pk910.de/" target="_blank" className="text-white underline hover:no-underline">goerliETH Faucet</a></li>
                        <li>Suave rigilETH: <a href="https://faucet.rigil.suave.flashbots.net/" target="_blank" className="text-white underline hover:no-underline">rigilETH Faucet</a></li>
                        <li>Wallet capable of <code>eth_sign</code>, either:</li>
                        <ul className="list-disc list-inside ml-6">
                            <li>Burner Wallet, or</li>
                            <li>MetaMask w/ Advanced Settings</li>
                        </ul>
                    </ol>
                    <p className="text-sm">
                        Once you have these items, you can Bid on a Block to add your message to the timeline.
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}

export default Onboarding