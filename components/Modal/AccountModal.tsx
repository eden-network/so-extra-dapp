import Modal from "./Modal"
import Image from "next/image"
import LottiePlayer from "../LottiePlayer";
import Disconnect from '../../public/lotties/Disconnect.json'

const AccountModal = ({
    showModal,
    toggleModal,
    walletAddress,
    goerliBalance,
    rigilBalance
}: {
    showModal: boolean,
    toggleModal: () => void,
    walletAddress: string | undefined,
    goerliBalance: string | undefined,
    rigilBalance: string | undefined
}) => {
    return (
        <>
            <Modal title="Your wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/unicorn-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                    <p className="font-modelica-bold text-xl">{walletAddress}</p>
                    <p>{goerliBalance} Goerli ETH</p>
                    <p>{rigilBalance} rigil ETH</p>
                    <button
                    >
                        <LottiePlayer src={Disconnect} />
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default AccountModal