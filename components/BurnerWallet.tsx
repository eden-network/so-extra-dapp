import { useEffect, useState } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from 'next/image'

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

    return <div className="flex flex-col pb-3">
        <div className="border-b pt-2 pb-3">
            <h2 className="text-2xl text-center font-semibold">
                My Burner Wallet
            </h2>
        </div>
        {displayOnboarding ? <>
        <div className="flex flex-col gap-2 p-3">
            <p className="text-sm">
                For this demo, the best UX we can think of is a burner wallet.
                If you are not already familiar with burner wallets, you can create and use a temporary wallet from your browser window.
            </p>
            <p className="text-sm">
                You will need to fund the burner wallet with a small amount and use it for the demo.
                If you want to recover your funds, you will be able to do so.
            </p>
        </div>
        <div className="px-2 my-2">
            <button
                className="py-2 rounded-full w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-green-500 text-white"
                onClick={handleButtonClick}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <Image src={`/Group.png`} width="36" height="44" alt="So Extra" />
                    <p className="font-semibold">Create My Burner Wallet</p>
                </div>
            </button>
        </div>
        </> : <>
        <div className="px-2 my-2">
            <label
                className="px-3 font-semibold"
                htmlFor="burner-address"
            >Burner Address:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="burner-address"
                type="text"
                value={account?.address}
            />
            <p
                className="text-sm text-right px-3"
            >Burner Balance: {balance !== undefined ? `${balance.formatted}` : `-` } goerliETH</p>
        </div>
        <div className="px-2 my-2">
            <label
                className="px-3 font-semibold"
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
                className="text-sm text-right px-3"
            >Wallet Balance: {walletBalance !== undefined ? `${walletBalance.formatted}` : `-` } goerliETH</p>
        </div>
        <div className="px-2 my-2">
            <button
                className="py-2 rounded-full w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-green-500 text-white"
                onClick={handleFundButtonClick}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <Image src={`/Group.png`} width="36" height="44" alt="So Extra" />
                    <p className="font-semibold">Fund My Burner Wallet</p>
                </div>
            </button>
        </div>
        </>}
    </div>
}

export default BurnerWallet