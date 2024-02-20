import Modal from "./Modal"
import Image from "next/image"
import BurnerWallet from "../BurnerWallet"

const BurnerModal = ({
    showModal,
    toggleModal,
    burnerAddress,
    goerliBalance,
    rigilBalance
}: {
    showModal: boolean,
    toggleModal: () => void,
    burnerAddress: string | undefined,
    goerliBalance: string | undefined,
    rigilBalance: string | undefined
}) => {
    return (
        <>
            <Modal title="Burner wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/burner-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                    <p className="font-modelica-bold text-xl">{burnerAddress}</p>
                    <p>{goerliBalance} Goerli ETH</p>
                    <p>{rigilBalance} rigil ETH</p>
                    <BurnerWallet />
                </div>
            </Modal>
        </>
    )
}

export default BurnerModal