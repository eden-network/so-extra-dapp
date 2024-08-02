import { useEffect, useState } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, useEstimateGas, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from "next/image"
import LottiePlayer from "./LottiePlayer"
import FundButton from '../public/lotties/Fund.json'

const BurnerWallet = () => {
    const { address: walletAddress, chain } = useAccount()
    const { data: walletBalance } = useBalance({
        address: walletAddress
    })

    const {
        account,
        hasExistingBurnerWallet
    } = useBurnerWallet()

    const [depositAmount, setDepositAmount] = useState<string>("")

    const { data: gasEstimate, refetch } = useEstimateGas({
        account: walletAddress,
        to: account?.address,
        value: parseEther(depositAmount)
    })
    const { sendTransaction } = useSendTransaction()

    const [displayOnboarding, setDisplayOnboarding] = useState<boolean>()
    useEffect(() => {
        if (hasExistingBurnerWallet() === true) {
            setDisplayOnboarding(false)
        }
        else {
            setDisplayOnboarding(true)
        }
    }, [account, hasExistingBurnerWallet])

    const handleFundButtonClick = () => {
        sendTransaction({
            gas: gasEstimate,
            to: account?.address,
            value: parseEther(depositAmount)
        })
    }

    const handleDepositAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            parseEther(event.target.value)
            setDepositAmount(event.target.value)
            refetch()
        }
        catch { }
    }

    useEffect(() => {
        refetch()
    }, [account?.address, refetch, depositAmount])

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
                    <p> {walletBalance !== undefined ? `${walletBalance.formatted}` : `-`} {chain?.nativeCurrency.symbol}</p>
                </div>
            </div>
            <div className="my-2 text-center relative">
                <button

                    onClick={handleFundButtonClick}
                    type="submit"
                >
                    <LottiePlayer src={FundButton} />
                </button>
            </div>
        </>
        }
    </div >
}

export default BurnerWallet