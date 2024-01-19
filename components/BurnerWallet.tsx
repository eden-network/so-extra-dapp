import { useEffect, useState } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"

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

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-rainbow-yellow font-modelica-bold">
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
            <div className="px-4 my-2 text-center">
                {/* <button
                className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black"
                onClick={handleButtonClick}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <p className="font-light">Create My Burner Wallet</p>
                </div>
            </button> */}
                <button
                    className="w-[263px] h-[44px] rounded-full bg-[url('/create-button.png')] disabled:bg-[url('/create-button-disabled.png')] hover:bg-[url('/create-button-hover.png')]"
                    onClick={handleButtonClick}
                    type="submit"
                >
                    <p className="hidden">Create Burner Wallet</p>
                </button>
            </div>
        </> : <>
            <div className="px-4 my-2">
                <label
                    className="font-light"
                    htmlFor="burner-address"
                >Burner Address</label>
                <input
                    className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                    id="burner-address"
                    type="text"
                    value={account?.address}
                />
                <p
                    className="text-sm text-right"
                >Burner Balance: {balance !== undefined ? `${balance.formatted}` : `-`} goerliETH</p>
            </div>
            <div className="px-4 my-2">
                <label
                    className="font-light"
                    htmlFor="deposit-amount"
                >Deposit Amount</label>
                <input
                    className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                    id="deposit-amount"
                    type="text"
                    value={depositAmount}
                    onChange={handleDepositAmountChange.bind(this)}
                />
                <p
                    className="text-sm text-right"
                >Wallet Balance: {walletBalance !== undefined ? `${walletBalance.formatted}` : `-`} goerliETH</p>
            </div>
            <div className="px-4 my-2 text-center">
                <button
                    className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black shadow-xl shadow-indigo-950/40 hover:shadow-none"
                    onClick={handleFundButtonClick}
                    type="submit"
                >
                    <div className="flex flex-row items-center justify-center">
                        <p className="font-semibold">Fund My Burner Wallet</p>
                    </div>
                </button>
            </div>
        </>}
    </div>
}

export default BurnerWallet