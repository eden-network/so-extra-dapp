import { useState } from "react"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/solid";
import useCustomChains from "../hooks/useCustomChains"

const Onboarding = ({
    toggleHelpModal
}: {
    toggleHelpModal: () => void
}) => {
    const [displayOnboarding, setDisplayOnboarding] = useState<boolean>(true)

    const { l1Chain: chain } = useCustomChains()

    const RelayLink = () => {
        if (!chain || chain.id == 1) {
            return <a className="text-white underline hover:no-underline" href="https://boost-relay.flashbots.net/" target="_blank">Flashbots Relay</a>
        }

        return <a className="text-white underline hover:no-underline" href={`https://boost-relay-${chain.name}.flashbots.net/`} target="_blank">Flashbots {chain.name} Relay</a>
    }
    
    return displayOnboarding ? (
        <div className="flex-1 w-full">
            <div className="flex flex-col pb-3">
                <div className="flex flex-row justify-end underline hover:no-underline px-3" onClick={() => setDisplayOnboarding(false)}>
                    <button className="text-sm">Close</button>
                    <XMarkIcon className="w-5 h-5 text-white" />
                </div>
                <div className="p-3">
                    <h2 className="text-2xl text-center font-bold text-rainbow-yellow font-modelica-bold">
                        Welcome to the show!
                    </h2>
                </div>
                <div className="flex flex-col gap-2 p-3 text-sm">
                    <p className="text-sm">
                        This app demonstrates building blocks using Confidential Requests. You will use testnet SUAVE to buy block extra data. Connect your wallet and follow the steps. Find out more in the <span onClick={toggleHelpModal} className="underline cursor-pointer hover:no-underline">help section</span>.
                    </p>
                    <p className="text-sm mt-4">
                        <span className="font-modelica-bold">How the auction works?</span><br />Bids are active for 100 blocks and each block, the winning bid is selected and attempted for inclusion in a block. Only some blocks are available for data inclusion.
                    </p>
                    <p className="text-sm mt-4">
                        <span className="font-modelica-bold">How much should I bid?</span><br />In order to win, your bid has to be competive with the latest payloads delivered by  <RelayLink />.
                    </p>
                </div>
                <div className="flex m-auto">
                    <Image src='/collab.svg' width={300} height={100} alt={'eden-flashbots'} />
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}

export default Onboarding