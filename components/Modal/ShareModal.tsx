import Modal from "./Modal"
import Image from "next/image"

const ShareModal = ({
    showModal,
    toggleModal,
}: {
    showModal: boolean,
    toggleModal: () => void,
}) => {
    return (
        <>
            <Modal title="Burner wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/burner-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                </div>
            </Modal>
        </>
    )
}

export default ShareModal