import { useEffect, useState } from "react"
import { parseEther } from "viem/utils"
import { useAccount, useBalance, useEstimateGas, useSendTransaction } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from "next/image"
import LottiePlayer from "./LottiePlayer"
import FundButton from '../public/lotties/Fund.json'
import useCustomChains from "../hooks/useCustomChains"
import useSuave from "../hooks/useSuave"

const BurnerWallet = () => {
    const { address: walletAddress, chain } = useAccount()
    const { l1Chain, suaveChain } = useCustomChains()
    const { suaveBurnerWallet, suaveProvider, connectedSuaveChain } = useSuave()
    const { account, hasExistingBurnerWallet } = useBurnerWallet()

    const [depositAmounts, setDepositAmounts] = useState({
        holesky: "",
        suave: ""
    })

    const { data: holeskyBalance } = useBalance({ address: walletAddress })
    const { data: suaveBalance } = useBalance({
        address: walletAddress,
        chainId: suaveChain.id
    })

    const { data: holeskyGasEstimate, refetch: refetchHoleskyGas } = useEstimateGas({
        account: walletAddress,
        to: account?.address,
        value: parseEther(depositAmounts.holesky || "0"),
        chainId: l1Chain.id
    })

    const { data: suaveGasEstimate, refetch: refetchSuaveGas } = useEstimateGas({
        account: walletAddress,
        to: account?.address,
        value: parseEther(depositAmounts.suave || "0"),
        chainId: suaveChain.id
    })

    const { sendTransaction } = useSendTransaction({})

    const [displayOnboarding, setDisplayOnboarding] = useState(false)

    useEffect(() => {
        setDisplayOnboarding(!hasExistingBurnerWallet())
    }, [account, hasExistingBurnerWallet])

    const handleFundButtonClick = async (chainType) => {
        const gasEstimate = chainType === 'holesky' ? holeskyGasEstimate : suaveGasEstimate
        const amount = depositAmounts[chainType]

        try {
            await sendTransaction({
                gas: gasEstimate,
                to: account?.address,
                value: parseEther(amount),
                chainId: chainType === 'holesky' ? chain?.id : suaveChain.id
            })
        } catch (error) {
            console.error(`Error sending ${chainType} transaction:`, error)
        }
    }

    const handleDepositAmountChange = (event, chainType) => {
        try {
            parseEther(event.target.value)
            setDepositAmounts(prev => ({ ...prev, [chainType]: event.target.value }))
            if (chainType === 'holesky') refetchHoleskyGas()
            else refetchSuaveGas()
        } catch { }
    }

    useEffect(() => {
        refetchHoleskyGas()
        refetchSuaveGas()
    }, [account?.address, refetchHoleskyGas, refetchSuaveGas])

    const renderDepositSection = (chainType, balance, chainSymbol) => (
        <div className="mb-6">
            <div className="flex flex-col text-left px-4 my-2">
                <label className="font-light mb-1" htmlFor={`deposit-amount-${chainType}`}>
                    Deposit Amount ({chainType === 'holesky' ? 'Holesky' : 'Toliman'} ETH)
                </label>
                <div className="relative">
                    <input
                        className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                        id={`deposit-amount-${chainType}`}
                        type="text"
                        value={depositAmounts[chainType]}
                        onChange={(e) => handleDepositAmountChange(e, chainType)}
                    />
                    <Image src="/eth_symbol.svg" alt="ETH Symbol" width="40" height="230" className="absolute right-1 top-1.5" />
                </div>
                <div className="flex justify-between mt-1">
                    <p className="text-xs text-left">Metamask:</p>
                    <div>
                        <p>{balance !== undefined ? `${balance.formatted}` : '-'} {chainSymbol}</p>
                    </div>
                </div>
            </div>
            <div className="my-2 text-center relative">
                <button onClick={() => handleFundButtonClick(chainType)} type="submit">
                    <LottiePlayer src={FundButton} />
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex items-center pb-3">
            {!displayOnboarding && (
                <>
                    {renderDepositSection('holesky', holeskyBalance, chain?.nativeCurrency.symbol)}
                    {renderDepositSection('suave', suaveBalance, suaveChain?.nativeCurrency.symbol)}
                </>
            )}
        </div>
    )
}

export default BurnerWallet