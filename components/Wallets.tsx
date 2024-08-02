
import { Dispatch, SetStateAction, useState } from "react"
import { useAccount, useBalance, useChains } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import AccountModal from "./Modal/AccountModal"
import BurnerModal from "./Modal/BurnerModal"
import { CustomConnectButton } from "./CustomConnectButton"
import SwitchButton from '../public/lotties/switch.json'
import AccountButton from '../public/lotties/account.json'
import BurnerAccountButton from '../public/lotties/burner_account.json'
import CreateBurner from '../public/lotties/burnerwallet.json'
import LottiePlayer from "./LottiePlayer"
import Image from "next/image";
import useCustomChains from "../hooks/useCustomChains"

const ellipsis = (str: string) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
}

const Wallets = ({
    useBurner,
    setUseBurner
}: {
    useBurner: boolean,
    setUseBurner: Dispatch<SetStateAction<boolean>>
}) => {

    const {
        account: burnerAccount,
        balance: burnerBalance,
        suaveBalance: burnerSuaveBalance,
        createBurnerWallet
    } = useBurnerWallet()

    const { address: walletAddress } = useAccount()


    const { l1Chain, suaveChain } = useCustomChains()

    const { data: balance } = useBalance({
        address: walletAddress,
        chainId: l1Chain.id
    })

    const { data: suaveBalance } = useBalance({ address: walletAddress, chainId: suaveChain.id })

    const handleButtonClickForCreateBurnerWallet = () => {
        createBurnerWallet()
        setUseBurner(true)
    }

    const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

    function toggleAccountModal() {
        setShowAccountModal(!showAccountModal);
    }

    const [showBurnerModal, setShowBurnerModal] = useState<boolean>(false);

    function toggleBurnerModal() {
        setShowBurnerModal(!showBurnerModal);
    }

    function handleBurnerButton() {
        setUseBurner(true)
    }

    function handleAccButton() {
        setUseBurner(false)
    }

    const { chain: walletConnectedChain } = useAccount()

    return (
        <>
            <div className="px-4 my-2">
                <h1 className="text-rainbow-yellow text-2xl text-center text-bold font-modelica-bold mb-6">Wallets</h1>
                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-white">Burner Wallet
                        <span className="text-white/70">{' '}&bull;{' '}{l1Chain?.name || 'Unsupported Network'}</span>
                    </p>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">
                        {burnerAccount === undefined ?
                            <button
                                className="w-[263px] h-[44px] rounded-full"
                                onClick={handleButtonClickForCreateBurnerWallet.bind(this)}
                                type="submit"
                            >
                                <LottiePlayer src={CreateBurner} />
                            </button> : <>
                                <p className="flex-1 mb-auto font-modelica-bold text-xl">
                                    <a href={`https://goerli.etherscan.io/address/${burnerAccount.address}`} target="_blank" className="hover:underline">
                                        {ellipsis(burnerAccount.address)}
                                    </a>
                                </p>
                                <div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <button onClick={toggleBurnerModal}>
                                                <LottiePlayer src={BurnerAccountButton} />
                                            </button>
                                        </div>
                                        <BurnerModal
                                            showModal={showBurnerModal}
                                            toggleModal={toggleBurnerModal}
                                        />
                                        {useBurner === true ?
                                            <div>
                                                <Image src="/active.svg" width="110" height="44" alt="active" />
                                            </div>
                                            :
                                            <div className="relative">
                                                <button
                                                    onClick={handleBurnerButton}
                                                    disabled={burnerAccount === undefined}
                                                >
                                                    <LottiePlayer src={SwitchButton} />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {burnerAccount !== undefined && <p
                                        className="flex flex-col text-xs mb-6 mt-2"
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span>{l1Chain.nativeCurrency.symbol}: </span>

                                            <span>{burnerBalance !== undefined ? `${parseFloat(burnerBalance.formatted).toLocaleString()}` : `-`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{suaveChain.nativeCurrency.symbol}: </span>
                                            <span>{burnerSuaveBalance !== undefined ? `${parseFloat(burnerSuaveBalance.formatted).toLocaleString()}` : `-`}</span>
                                        </div>
                                    </p>}
                                </div>
                            </>}
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm mb-1 text-white pt-6">
                            {'Metamask Wallet'}
                            <span className="text-white/70">{' '}&bull;{' '}{walletConnectedChain?.name || 'Unsupported Network'}</span></p>
                    </div>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">
                        {walletAddress === undefined ? <CustomConnectButton /> :
                            <>
                                <p className="flex-1 font-modelica-bold text-xl mb-auto">
                                    <a href={`https://goerli.etherscan.io/address/${walletAddress}`} target="_blank" className="hover:underline">
                                        {ellipsis(walletAddress)}
                                    </a>
                                </p>
                                <div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <button onClick={toggleAccountModal}>

                                                <LottiePlayer src={AccountButton} />
                                            </button>
                                        </div>
                                        <AccountModal
                                            showModal={showAccountModal}
                                            toggleModal={toggleAccountModal}
                                            walletAddress={ellipsis(walletAddress !== undefined ? walletAddress : '')}
                                            goerliBalance={balance !== undefined ? parseFloat(balance.formatted).toLocaleString() : ''}
                                            rigilBalance={suaveBalance !== undefined ? `${parseFloat(suaveBalance.formatted).toLocaleString()}` : ''}
                                        />
                                        {useBurner === false ?
                                            <div>
                                                <Image src="/active.svg" width="110" height="44" alt="active" />
                                            </div>
                                            :
                                            <div className="relative">

                                                <button
                                                    onClick={handleAccButton}
                                                >
                                                    <LottiePlayer src={SwitchButton} />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {walletAddress !== undefined && <p
                                        className="flex flex-col text-xs mb-6 mt-2"
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span>{l1Chain.nativeCurrency.symbol}: </span>
                                            <span>{' '}{balance !== undefined ? `${parseFloat(balance.formatted).toLocaleString()}` : `-`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{suaveChain.nativeCurrency.symbol}:</span>
                                            <span>{suaveBalance !== undefined ? `${parseFloat(suaveBalance.formatted).toLocaleString()}` : `-`}</span>
                                        </div>
                                    </p>}
                                </div>
                            </>}
                    </div>
                </div>
            </div >
        </>
    )
}

export default Wallets