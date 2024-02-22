
import { Dispatch, SetStateAction, useState, useRef, LegacyRef } from "react"
import { useAccount, useBalance } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import AccountModal from "./Modal/AccountModal"
import BurnerModal from "./Modal/BurnerModal"
import ButtonLottie from '../public/lotties/button.json'
import { CustomConnectButton } from "./CustomConnectButton"
import { Player } from '@lottiefiles/react-lottie-player';
import SwitchButton from '../public/lotties/switch.json'
import AccountButton from '../public/lotties/account.json'
import BUrnerAccountButton from '../public/lotties/burner_account.json'
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
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey,
        createBurnerWallet
    } = useBurnerWallet()

    const { rigil } = useSuave()

    const { address: walletAddress } = useAccount()

    const { data: balance } = useBalance({
        address: walletAddress
    })

    const { data: rigilBalance } = useBalance({ address: walletAddress, chainId: rigil.id })

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

    const [isHoveredBurner, setIsHoveredBurner] = useState<boolean>(false)
    const [isHoveredAcc, setIsHoveredAcc] = useState<boolean>(false)
    const [isHoveredBurnerSwitch, setIsHoveredBurnerSwitch] = useState<boolean>(false)
    const [isHoveredAccSwitch, setIsHoveredAccSwitch] = useState<boolean>(false)

    function handleBurnerButton() {
        setUseBurner(true)
    }

    function handleAccButton() {
        setIsHoveredBurnerSwitch(false)
        setUseBurner(false)
    }
    const lottieRef = useRef<Player | undefined>(undefined) as LegacyRef<Player>
    return (
        <>
            <div className="px-4 my-2">
                <h1 className="text-rainbow-yellow text-2xl text-center text-bold font-modelica-bold">Wallets</h1>
                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-white">Burner wallet</p>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">

                        {/* <p className="">Burner wallet</p> */}
                        {burnerAccount === undefined ? <button
                            className="w-[263px] h-[44px] rounded-full bg-[url('/create-button.png')] disabled:bg-[url('/create-button-disabled.png')] hover:bg-[url('/create-button-hover.png')]"
                            onClick={handleButtonClickForCreateBurnerWallet.bind(this)}
                            type="submit"
                        >
                            <p className="hidden">Create Burner Wallet</p>
                        </button> : <>
                            <p className="flex-1 mb-auto font-modelica-bold text-xl">
                                <a href={`https://goerli.etherscan.io/address/${burnerAccount.address}`} target="_blank" className="hover:underline">
                                    {ellipsis(burnerAccount.address)}
                                </a>
                            </p>
                            <div>
                                <div className="flex gap-2">
                                    <div className="relative" onMouseEnter={() => setIsHoveredBurner(true)} onMouseLeave={() => setIsHoveredBurner(false)}>
                                        <button onClick={toggleBurnerModal}>
                                            <Player
                                                ref={lottieRef}
                                                src={BUrnerAccountButton}
                                                hover={true}
                                                className=""
                                                loop={false}
                                                keepLastFrame={true}
                                            />
                                        </button>
                                    </div>
                                    <BurnerModal
                                        showModal={showBurnerModal}
                                        toggleModal={toggleBurnerModal}
                                        burnerAddress={ellipsis(burnerAccount.address)}
                                        goerliBalance={burnerBalance !== undefined ? parseFloat(burnerBalance.formatted).toLocaleString() : ''}
                                        rigilBalance={burnerRigilBalance !== undefined ? `${parseFloat(burnerRigilBalance.formatted).toLocaleString()}` : ''}
                                    />
                                    {useBurner === true ?
                                        <button className="bg-[url('/active-btn.svg')] w-[114px] h-[34px]" />
                                        :
                                        <div className="relative" onMouseEnter={() => setIsHoveredBurnerSwitch(true)} onMouseLeave={() => setIsHoveredBurnerSwitch(false)}>
                                            <button
                                                onClick={handleBurnerButton}
                                                disabled={burnerAccount === undefined}
                                            >
                                                <Player
                                                    ref={lottieRef}
                                                    src={SwitchButton}
                                                    hover={true}
                                                    className=""
                                                    loop={false}
                                                    keepLastFrame={true}
                                                />
                                            </button>
                                        </div>
                                    }
                                </div>
                                {burnerAccount !== undefined && <p
                                    className="flex flex-col text-xs mb-6 mt-2"
                                >
                                    <div className="flex justify-between mb-1">
                                        <span>goerliETH: </span>

                                        <span>{burnerBalance !== undefined ? `${parseFloat(burnerBalance.formatted).toLocaleString()}` : `-`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>rigilETH: </span>
                                        <span>{burnerRigilBalance !== undefined ? `${parseFloat(burnerRigilBalance.formatted).toLocaleString()}` : `-`}</span>
                                    </div>
                                </p>}
                            </div>
                        </>}
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm mb-1 text-white">Metamask Wallet</p>
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
                                                <Player
                                                    ref={lottieRef}
                                                    src={AccountButton}
                                                    hover={true}
                                                    className=""
                                                    loop={false}
                                                    keepLastFrame={true}
                                                />
                                            </button>
                                        </div>
                                        <AccountModal
                                            showModal={showAccountModal}
                                            toggleModal={toggleAccountModal}
                                            walletAddress={ellipsis(walletAddress !== undefined ? walletAddress : '')}
                                            goerliBalance={balance !== undefined ? parseFloat(balance.formatted).toLocaleString() : ''}
                                            rigilBalance={rigilBalance !== undefined ? `${parseFloat(rigilBalance.formatted).toLocaleString()}` : ''}
                                        />
                                        {useBurner === false ?
                                            <button className="bg-[url('/active-btn.svg')] w-[114px] h-[34px]" />
                                            :
                                            <div className="relative" onMouseEnter={() => setIsHoveredAccSwitch(true)} onMouseLeave={() => setIsHoveredAccSwitch(false)}>

                                                <button
                                                    onClick={handleAccButton}
                                                >
                                                    <Player
                                                        ref={lottieRef}
                                                        src={SwitchButton}
                                                        hover={true}
                                                        className=""
                                                        loop={false}
                                                        keepLastFrame={true}
                                                    />

                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {walletAddress !== undefined && <p
                                        className="flex flex-col text-xs mb-6 mt-2"
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span>goerliETH: </span>
                                            <span>{' '}{balance !== undefined ? `${parseFloat(balance.formatted).toLocaleString()}` : `-`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>rigilETH:</span>
                                            <span>{rigilBalance !== undefined ? `${parseFloat(rigilBalance.formatted).toLocaleString()}` : `-`}</span>
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