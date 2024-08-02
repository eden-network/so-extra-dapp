
import Modal from "./Modal"
import Image from "next/image"
import BurnerWallet from "../BurnerWallet"
import useBurnerWallet from "../../hooks/useBurnerWallet"
import { formatUnits } from "viem"
import useSuave from "../../hooks/useSuave"
import { useAccount } from "wagmi"

const ellipsis = (str: string) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
}

const BurnerModal = ({
    showModal,
    toggleModal,
}: {
    showModal: boolean,
    toggleModal: () => void,
}) => {
    const { 
        account,
        balance,
        suaveBalance,
    } = useBurnerWallet()

    const burnerAddress = account?.address

    const formattedBalance = balance ? formatUnits(balance.value, balance.decimals) : undefined
    const formattedSuaveBalance = suaveBalance ? formatUnits(suaveBalance.value, suaveBalance.decimals) : undefined

    const { chain } = useAccount()
    const { connectedSuaveChain } = useSuave()

    return (
        <>
            <Modal title="Burner wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/burner-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                    <p className="font-modelica-bold text-xl">{burnerAddress && ellipsis(burnerAddress)}</p>
                    <p>{formattedBalance} {chain?.nativeCurrency.symbol}</p>
                    <p>{formattedSuaveBalance} {connectedSuaveChain.nativeCurrency.symbol}</p>
                    <BurnerWallet />
                </div>
            </Modal>
        </>
    )
}

export default BurnerModal