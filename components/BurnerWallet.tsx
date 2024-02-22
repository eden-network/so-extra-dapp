import { useEffect, useState, useRef, LegacyRef } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from "next/image"
import { Player } from '@lottiefiles/react-lottie-player';
import FundButton from '../public/lotties/Fund.json'

const BurnerWallet = () => {
    const { address: walletAddress } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletAddress
    })

    const {
        account,
        balance,
        hasExistingBurnerWallet,
        createBurnerWallet
    } = useBurnerWallet()

    const [depositAmount, setDepositAmount] = useState<string>("")

    const { config, error } = usePrepareSendTransaction({
        account: walletAddress,
        to: account?.address,
        value: parseEther(depositAmount)
    })
    const { sendTransaction } = useSendTransaction(config)

    const [displayOnboarding, setDisplayOnboarding] = useState<boolean>()
    useEffect(() => {
        if (hasExistingBurnerWallet() === true) {
            setDisplayOnboarding(false)
        }
        else {
            setDisplayOnboarding(true)
        }
    }, [account, hasExistingBurnerWallet])

    const handleButtonClick = () => {
        createBurnerWallet()
    }

    const handleFundButtonClick = () => {
        sendTransaction?.()
    }

    const handleDepositAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            parseEther(event.target.value)
            setDepositAmount(event.target.value)
        }
        catch { }
    }

    const lottieRef = useRef<Player | undefined>(undefined) as LegacyRef<Player>;

    return <div className="flex items-center pb-3">
        {displayOnboarding ? <>

        </> : <>
            <div className="flex flex-col text-left px-4 my-2">
                <label
                    className="font-light mb-1"
                    htmlFor="deposit-amount"
                >Deposit Amount</label>
                <div className="relative">
                    <input
                        className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                        id="deposit-amount"
                        type="text"
                        value={depositAmount}
                        onChange={handleDepositAmountChange.bind(this)}
                    />
                    <Image src="/eth_symbol.svg" alt="So Extra" width="40" height="230" className="absolute right-1 top-1.5" />
                </div>
                <div className="flex justify-between mt-1">
                    <p className="text-xs text-left">Metamask:</p>
                    <p> {walletBalance !== undefined ? `${walletBalance.formatted}` : `-`} goerliETH</p>
                </div>
            </div>
            <div className="my-2 text-center relative">
                <button

                    onClick={handleFundButtonClick}
                    type="submit"
                >
                    <Player
                        ref={lottieRef}
                        src={FundButton}
                        hover={true}
                        className=""
                        loop={false}
                        keepLastFrame={true}
                    />
                </button>
            </div>
        </>
        }
    </div >
}

export default BurnerWallet