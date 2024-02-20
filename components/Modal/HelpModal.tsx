import Modal from "./Modal"

const HelpModal = ({
    showModal,
    toggleModal
}: {
    showModal: boolean,
    toggleModal: () => void
}) => {
    return (
        <>
            <Modal title="Help! What dis?" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6">
                    <p>Welcome to the show!</p>
                    <p>In this demo, you will use testnet SUAVE to buy block extra data on Testnet Ethereum.</p>
                    <p><b className="font-modelica-bold">What does this app demonstrate?</b> <br />This app demonstrates building Goerli blocks using Confidential Requests.In this case, Goerli blocks are built using custom extra data based on an auction that takes place in SUAVE.</p>
                    <p><b className="font-modelica-bold">How does the auction work?</b><br />Sealed bids are collected by the SUAPP. Bids consist of an amount, message and expiry. Each block, the winning bid is selected and attempted for inclusion in a block. The block is submitted to Goerli for inclusion.</p>
                    <p><b className="font-modelica-bold">How much should I bid?</b><br />In order to win, your bid has to be competive with the latest payloads delivered by Flashbots Goerli Relay</p>
                    <h2 className="font-modelica-bold text-center text-rainbow-yellow text-xl">Before you start, there are a few prequisites.</h2>
                    <p>You need:</p>
                    <p className="font-modelica-bold">1. Wallet capable of eth_sign, either:</p>
                    <ul>
                        <li>
                            - Burner wallet provided in the app, or
                        </li>
                        <li>
                            - Metamask with advanced settings:
                            <br />
                            <span>Open your Metamask app. Go to settings advanced and scroll to the bottom to activate the toggle by</span><b className="font-modelica-bold">Eth_sign requests</b>
                        </li>
                    </ul>
                    <p className="font-modelica-bold">2. Goerli ETH: goerliETH Faucet</p>
                    <p><b className="font-modelica-bold">3. Suave rigilETH: rigilETH Faucet</b><br />Once you have these items, you can Bid on a Block to add your message to the timeline.</p>
                </div>
            </Modal>
        </>
    )
}

export default HelpModal