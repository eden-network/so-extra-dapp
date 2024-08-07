import Modal from "./Modal"
import Image from "next/image"
import LottiePlayer from "../LottiePlayer";
import Disconnect from '../../public/lotties/Disconnect.json'
import useCustomChains from "../../hooks/useCustomChains";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import ellipsis from "../../lib/ellipsis";
import { formatUnits } from "@flashbots/suave-viem";
import { getFaucetUrl } from "../../lib/Faucets";
import Link from "next/link";

const AccountModal = ({
    showModal,
    toggleModal,
}: {
    showModal: boolean,
    toggleModal: () => void,
}) => {
    const { address } = useAccount()
    const { l1Chain, suaveChain } = useCustomChains()
    const { data: balance } = useBalance({ address: address, chainId: l1Chain.id })
    const { data: suaveBalance } = useBalance({ address: address, chainId: suaveChain.id })
    const { disconnect } = useDisconnect();

    const formattedBalance = balance ? formatUnits(balance.value, balance.decimals) : undefined
    const formattedSuaveBalance = suaveBalance ? formatUnits(suaveBalance.value, suaveBalance.decimals) : undefined

    const handleDisconnect = () => {
        disconnect();
        toggleModal();
    };

    const l1FaucetUrl = getFaucetUrl(l1Chain)
    const suaveFaucetUrl = getFaucetUrl(suaveChain)

    return (
        <>
            <Modal title="Your wallet" open={showModal} onClose={toggleModal}>
                <div className="flex flex-col gap-4 p-6 min-w-[300px] text-center items-center">
                    <Image src={'/unicorn-acc.svg'} width={150} height={200} alt="unicorn-acc" />
                    <p className="font-modelica-bold text-xl">
                        {address !== undefined ? ellipsis(address) : ""}
                    </p>
                    <div className="flex flex-row items-center gap-1">
                        <span>{formattedBalance !== undefined ? parseFloat(formattedBalance).toLocaleString() : '-'}</span>
                        <span>{l1Chain.nativeCurrency.symbol}</span>
                        <span>({l1Chain.nativeCurrency.name})</span>
                        {l1FaucetUrl &&
                            <Link href={l1FaucetUrl} target="_blank">
                                <div className="flex gap-2 bg-white/10 text-white/30 border border-white/30 hover:border-white px-3 py-0.5 rounded">
                                    <Image src={"/faucet.svg"} width={10} height={10} alt="faucet" />
                                    <span className="text-white text-xs hover:no-underline">Faucet</span>
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
                                    <span className="text-white text-xs hover:no-underline">Faucet</span>
                                </div>
                            </Link>}
                    </div>
                    <button
                        onClick={handleDisconnect}
                    >
                        <LottiePlayer src={Disconnect} />
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default AccountModal