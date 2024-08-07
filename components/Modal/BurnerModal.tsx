
import Modal from "./Modal"
import Image from "next/image"
import BurnerWallet from "../BurnerWallet"
import useBurnerWallet from "../../hooks/useBurnerWallet"
import { formatUnits } from "viem"
import useCustomChains from "../../hooks/useCustomChains"
import ellipsis from "../../lib/ellipsis"
import { getFaucetUrl } from "../../lib/Faucets"
import Link from "next/link"

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

    const { l1Chain, suaveChain } = useCustomChains()
    
    const l1FaucetUrl = getFaucetUrl(l1Chain)
    const suaveFaucetUrl = getFaucetUrl(suaveChain)

    return (
        <>
            <Modal title="Burner wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/burner-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                    <p className="font-modelica-bold text-xl">{burnerAddress && ellipsis(burnerAddress)}</p>
                    <div className="flex flex-row items-center gap-1">
                        <span>{formattedBalance !== undefined ? parseFloat(formattedBalance).toLocaleString() : '-'}</span>
                        <span>{l1Chain.nativeCurrency.symbol}</span>
                        <span>({l1Chain.nativeCurrency.name})</span>
                        {l1FaucetUrl && 
                            <Link href={l1FaucetUrl} target="_blank">
                                <div className="flex gap-2 bg-white/10 text-white/30 border border-white/30 hover:border-white px-3 py-0.5 rounded">
                                    <Image src={"/faucet.svg"} width={10} height={10} alt="faucet" />
                                    <p className="text-white text-xs hover:no-underline">Faucet</p>
                                </div>
                            </Link>}
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <span>{formattedSuaveBalance !== undefined ? parseFloat(formattedSuaveBalance).toLocaleString() : `-`}</span>
                        <span>{suaveChain.nativeCurrency.symbol}</span>
                        <span>({suaveChain.nativeCurrency.name})</span>
                        {suaveFaucetUrl && 
                            <Link href={suaveFaucetUrl} target="_blank">
                                <div className="flex gap-2 bg-white/10 text-white/30 border border-white/30 hover:border-white px-3 py-0.5 rounded">
                                    <Image src={"/faucet.svg"} width={10} height={10} alt="faucet" />
                                    <p className="text-white text-xs hover:no-underline">Faucet</p>
                                </div>
                            </Link>}
                    </div>
                    <BurnerWallet />
                </div>
            </Modal>
        </>
    )
}

export default BurnerModal