import { useEffect, useState } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from 'next/image'
import styles from '../styles/Home.module.css';

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

    const [ depositAmount, setDepositAmount ] = useState<string>("")

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
        catch {}
    }

    return <div className="flex flex-col">
        {displayOnboarding && <div className="flex flex-col gap-2">
            <p className="text-sm">
                Welcome to the show.
            </p>
            <p className="text-sm">
                For this demo, the best UX we can think of is a burner wallet.
                If you are not already familiar with burner wallets, you can create and use a temporary wallet from your browser window.
            </p>
            <p className="text-sm">
                You will need to fund the burner wallet with a small amount and use it for the demo.
                If you want to recover your funds, you will be able to do so.
            </p>
            <div>
                <button
                    className="bg-emerald-400 hover:bg-emerald-200 my-2 py-2 px-4 rounded w-full"
                    onClick={handleButtonClick}
                    type="submit"
                >Create My Burner Wallet</button>
            </div>
        </div>}
        <div>
            <label
                className="mr-2"
                htmlFor="burner-address"
            >Burner Address:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="burner-address"
                type="text"
                value={account?.address}
            />
            <p
                className="text-sm text-right"
            >Burner Balance: {balance !== undefined ? `${balance.formatted} ${balance.symbol}` : `- ETH` }</p>
        </div>
        <div>
            <label
                className="mr-2"
                htmlFor="deposit-amount"
            >Deposit Amount:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="deposit-amount"
                type="text"
                value={depositAmount}
                onChange={handleDepositAmountChange.bind(this)}
            />
            <p
                className="text-sm text-right"
            >Wallet Balance: {walletBalance !== undefined ? `${walletBalance.formatted} ${walletBalance.symbol}` : `- ETH` }</p>
        </div>
        <div>
            <button
                className="my-2 py-2 px-4 rounded-full w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-green-500 text-white"
                onClick={handleFundButtonClick}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <Image src={`/Group.png`} width="36" height="44" alt="So Extra" />
                    <p className="font-semibold">Fund My Burner Wallet</p>
                </div>
            </button>
        </div>
    </div>
}

export default BurnerWallet