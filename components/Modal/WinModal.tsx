import Modal from "./Modal"

const WinModal = ({
    showModal,
    toggleModal
}: {
    showModal: boolean,
    toggleModal: () => void
}) => {
    return (
        <>
            <Modal title="You won!" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6">
                    <p>You did it! You have inscribed your message of wisdom on the blockchain to be marveled at for all eternity.</p>
                    <p>Now share your accomplishment with your friends!</p>
                </div>
            </Modal>
        </>
    )
}

export default WinModal