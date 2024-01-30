
import { Dispatch, SetStateAction, useState } from "react"
import { useAccount, useBalance } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import { CustomConnectButton } from "./CustomConnectButton"
import useSuave from "../hooks/useSuave"
import AccountModal from "./Modal/AccountModal"
import BurnerModal from "./Modal/BurnerModal"

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
        setIsHoveredAccSwitch(false)
        setUseBurner(true)
    }

    function handleAccButton() {
        setIsHoveredBurnerSwitch(false)
        setUseBurner(false)
    }

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
                                <div className="flex">
                                    <div className="relative" onMouseEnter={() => setIsHoveredBurner(true)} onMouseLeave={() => setIsHoveredBurner(false)}>
                                        <button onClick={toggleBurnerModal} className="bg-[url('/plus-account.svg')] w-[54px] h-[34px] mr-1" />
                                        <button onClick={toggleBurnerModal} className={`${isHoveredBurner ? "flex" : "hidden"} bg-[url('/plus-account-hover.svg')] w-[54px] h-[34px] mr-1 absolute left-0 top-0`} />
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
                                                className="w-[114px] h-[34px] rounded-full bg-[url('/switch-btn.svg')]"
                                                onClick={handleBurnerButton}
                                                disabled={burnerAccount === undefined}
                                            />
                                            <button
                                                className={`${isHoveredBurnerSwitch ? "flex" : "hidden"} w-[114px] h-[34px] rounded-full bg-[url('/switch-hover.svg')] left-0 top-0 absolute`}
                                                onClick={handleBurnerButton}
                                                disabled={burnerAccount === undefined}
                                            />
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
                    <p className="text-sm mb-1 text-white">Metamask Wallet</p>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">
                        {/* <p className="">Wallet</p> */}
                        {walletAddress === undefined ? <CustomConnectButton isSmall={true} /> :
                            <>
                                <p className="flex-1 font-modelica-bold text-xl mb-auto">
                                    <a href={`https://goerli.etherscan.io/address/${walletAddress}`} target="_blank" className="hover:underline">
                                        {ellipsis(walletAddress)}
                                    </a>
                                </p>
                                <div>
                                    <div className="flex">
                                        <div className="relative" onMouseEnter={() => setIsHoveredAcc(true)} onMouseLeave={() => setIsHoveredAcc(false)}>
                                            <button onClick={toggleAccountModal} className="bg-[url('/account.svg')] hover:bg-[url('/account-hover.svg')] w-[54px] h-[34px] mr-1" />
                                            <button onClick={toggleAccountModal} className={`${isHoveredAcc ? "flex" : "hidden"} bg-[url('/account-hover.svg')] w-[54px] h-[34px] mr-1 absolute left-0 top-0`} />
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
                                                    className="w-[114px] h-[34px] rounded-full bg-[url('/switch-btn.svg')]"
                                                    onClick={handleAccButton}
                                                    disabled={burnerAccount === undefined}
                                                />
                                                <button
                                                    className={`${isHoveredAccSwitch ? "flex" : "hidden"} w-[114px] h-[34px] rounded-full bg-[url('/switch-hover.svg')] absolute left-0 top-0`}
                                                    onClick={handleAccButton}
                                                    disabled={burnerAccount === undefined}
                                                />
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