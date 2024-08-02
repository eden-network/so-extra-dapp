import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt, Transaction, TransactionLegacy, TransactionRequest, TransactionSerializable, TransactionSerializedLegacy, Hash } from "viem"
import { useAccount, useBalance, useBlockNumber, useConnectorClient, usePrepareTransactionRequest } from "wagmi"
import { createConfidentialComputeRecord, removeLeadingZeros, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { PrivateKeyAccount } from "viem"
import { executionNodes, suaveContractAddress } from "../lib/Deployments"
import Image from "next/image"
import SignButton from '../public/lotties/signButton.json'
import SubmitButton from '../public/lotties/submitButton.json'
import { PostConnectButton } from "./PostConnectButton"
import LottiePlayer from "./LottiePlayer"
import {
  type TransactionRequestSuave
} from '@flashbots/suave-viem/chains/utils';
import useCustomChains from "../hooks/useCustomChains"

const gasPriceForBidAmount = (bidAmount: number): bigint => {
    const bidAmountBigInt = parseEther(bidAmount.toString())
    const gasLimit = BigInt(21_000)
    return bidAmountBigInt / gasLimit
}

const BlockBid = ({
    useBurner,
    setUseBurner,
    burnerAccount,
    walletAddress,
    signedTx,
    setSignedTx,
    rigilTx,
    setRigilTx,
    rigilTxReceipt,
    setRigilTxReceipt
}: {
    useBurner: boolean,
    setUseBurner: Dispatch<SetStateAction<boolean>>,
    burnerAccount: PrivateKeyAccount | undefined,
    walletAddress: `0x${string}` | undefined,
    signedTx: string | undefined
    setSignedTx: Dispatch<SetStateAction<string | undefined>>
    rigilTx: string | undefined,
    setRigilTx: Dispatch<SetStateAction<string | undefined>>,
    rigilTxReceipt: TransactionReceipt | undefined,
    setRigilTxReceipt: Dispatch<SetStateAction<TransactionReceipt | undefined>>
}) => {
    const [extraData, setExtraData] = useState<string>("So Extra ✨")
    const [bytesLength, setBytesLength] = useState<number>(12)
    const {
        balance: burnerBalance,
        privateKey: burnerPrivateKey,
    } = useBurnerWallet()

    const { l1Chain: chain } = useCustomChains()
    // const { chain } = useAccount()
    const { suaveBurnerWallet, suaveProvider } = useSuave()

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.25)
    const [gasPrice, setGasPrice] = useState<bigint>(gasPriceForBidAmount(bidAmount))

    const [errorMessage, setErrorMessage] = useState<string>()

    useEffect(() => {
        setSignedTx(undefined)
    }, [bidAmount, useBurner])

    const handleExtraDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value
        const bytes = stringToBytes(text)
        if (bytes.length <= MAX_BYTES_LENGTH) {
            setBytesLength(bytes.length)
            setExtraData(event.target.value)
        }
    }

    const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const bidAmount = event.target.value as unknown as number
        const gasPrice = gasPriceForBidAmount(bidAmount)
        setBidAmount(bidAmount)
        setGasPrice(gasPrice)
    }

    const { data: walletClient } = useConnectorClient()

    useEffect(() => {
        if (walletAddress === undefined) {
            if (burnerAccount !== undefined) {
                setUseBurner(true)
            }
        }

        else {
            setUseBurner(false)
        }
    }, [burnerAccount, walletAddress])

    const { data: currentL1Block } = useBlockNumber({ chainId: chain.id })

    const { data: request } = usePrepareTransactionRequest({
        chainId: chain.id,
        account: useBurner ? burnerAccount : walletAddress,
        to: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress,
        gasPrice: gasPrice,
    })

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }
        console.log('gas', gasPrice);
        try {
            // create request with viem
            // const request: TransactionRequest = await walletClient.prepareTransactionRequest({
            //     chainId: chain?.id,
            //     account: useBurner ? burnerAccount : walletAddress,
            //     to: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress,
            //     gasPrice: gasPrice,
            // })
            console.log("request", request)

            // augment request with chain id (required)
            // const augmentedTx = { ...request/*, chainId: chain?.id */}
            const requestTyped = request as unknown as TransactionRequest
            console.log("requestTyped", requestTyped)

            // @ts-expect-error
            const serialized = serializeTransaction(requestTyped)
            console.log("serialized", serialized)

            // ensure serialized tx is valid

            // @ts-expect-error
            const parsedTx: TransactionSerializedLegacy = parseTransaction(serialized)
            console.log(`parsedTx`, parsedTx)

            try {
                let serializedSignedTx;
                if (useBurner) {
                    // @ts-expect-error
                    serializedSignedTx = await burnerAccount?.signTransaction(requestTyped)
                }
                else {
                    const serializedHash = keccak256(serialized)
                    // sign with metamask (required advanced setting enabled)
                    const hexSignature = await (window as any).ethereum.request({ method: 'eth_sign', params: [walletAddress, serializedHash] })
                    const signature = hexToSignature(hexSignature)
                    // @ts-expect-error
                    serializedSignedTx = serializeTransaction(requestTyped, signature)
                }
                setSignedTx(serializedSignedTx!)
                if (useBurner === true) {
                    handleButtonClickForSignedTx()
                }
            }
            catch (error: any) {
                throw error
            }
        }
        catch (error: any) {
            console.log(error)
            setErrorMessage(error?.message)
        }
    }

    const handleButtonClickForSignedTx = async () => {
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        const abiItem = parseAbiItem(
            'function buyAd(uint64 blockLimit, string memory extra)',
        )

        // Public data
        const calldata = encodeFunctionData({
            abi: [abiItem],
            functionName: 'buyAd',
            args: [(currentL1Block || BigInt(0)) + BID_VALID_FOR_BLOCKS, extraData]
        })

        // Confidential data
        const confidentialBytes = txToBundleBytes(signedTx as `0x${string}`) as `0x${string}`

        const ccr: TransactionRequestSuave = {
            chainId: suaveProvider.chain.id,
            data: calldata,
            confidentialInputs: confidentialBytes,
            gas: BigInt(1e6),
            gasPrice: await suaveProvider.getGasPrice(),
            nonce: await suaveProvider.getTransactionCount({ address: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress! }),
            to: suaveContractAddress,
            value: BigInt(0),
            type: "0x43", // transaction type for Confidential Compute Request
            isEIP712: false, 
            kettleAddress: executionNodes[suaveProvider.chain.id]
        }
        console.log(`suave ccr`, ccr)

        var ccrRlp
        if (useBurner && suaveBurnerWallet !== undefined) {
            ccrRlp = await suaveBurnerWallet.signTransaction(ccr)
        } else {
            const signingCallback = async (_hash: string) => {
                const hexSig = await (window as any).ethereum.request({ method: 'eth_sign', params: [walletAddress, _hash] })
                const sig = hexToSignature(hexSig)
                sig.r = removeLeadingZeros(sig.r) as `0x${string}`
                sig.s = removeLeadingZeros(sig.s) as `0x${string}`
                sig.v = Number(sig.v) == 27 ? BigInt(0) : BigInt(1)
                console.log("sig", sig)
                return { r: sig.r, s: sig.s, v: Number(sig.v) } as SigSplit
            }
            // ccrRlp = await ccr.signWithAsyncCallback(signingCallback).then(ccr => ccr.rlpEncode())
        }

        console.log("debug::ccr", ccr)
        console.log("debug::ccrRlp", ccrRlp)

        const hash: Hash = await suaveProvider.sendRawTransaction({
            //// BREAKS /////
            serializedTransaction: ccrRlp as `0x${string}`
        })

        console.log(`suave hash`, hash)
        setRigilTx(hash)

        // @ts-expect-error
        const receipt: TransactionReceipt = await suaveProvider.waitForTransactionReceipt({
            hash: hash
        })
        console.log(`suave receipt`, receipt)
        setRigilTxReceipt(receipt)
        console.log("suave receipt", rigilTxReceipt)
    }

    const { data: balance } = useBalance({
        address: walletAddress
    })

    const [bidAmountError, setBidAmountError] = useState<"balance" | "input" | undefined>(undefined)

    useEffect(() => {
        const bidAmountBigInt = parseEther(bidAmount.toString())
        if (bidAmountBigInt <= BigInt(0)) {
            setBidAmountError("input")
            return
        }

        if (useBurner === true && burnerBalance !== undefined) {
            setBidAmountError(bidAmountBigInt > burnerBalance.value ? "balance" : undefined)
            return
        }
        else if (useBurner === false && balance !== undefined) {
            setBidAmountError(bidAmountBigInt > balance.value ? "balance" : undefined)
            return
        }
    }, [bidAmount, useBurner, burnerBalance, balance])

    return <div className="flex flex-col py-4 border border-white/30 bg-white/5 backdrop-blur-lg">
        <div className="relative px-4 my-2">
            <label
                className="font-light text-sm"
                htmlFor="extra-data"
            >{'Extra data'}
                <span className="text-white/70">{' '}&bull;{' '}Public Data</span>
            </label>
            <input
                className="border border-fuchsia-600 w-full px-3 py-3 rounded-sm text-white font-modelica-bold text-xl shadow-inner bg-black/20 font-modelica-medium focus-visible:outline-none mt-1"
                id="extra-data"
                type="text"
                value={extraData}
                onChange={handleExtraDataChange.bind(this)}
            />
            <p className="absolute right-7 bottom-1.5 text-sm text-center text-white/60">{
                bytesLength} / {MAX_BYTES_LENGTH}<br /> bytes
            </p>
        </div>
        <div className="px-4 flex">
            <div className="flex flex-col w-1/2">
                <label className="font-light text-sm" htmlFor="bid-amount">
                    {'Bid Amount'}
                    <span className="text-white/70">{' '}&bull;{' '}Confidential Data</span>
                </label>
                <div className="flex relative">
                    <input
                        className={`[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border mt-1 ${bidAmountError !== undefined ? `text-red-500` : `text-white`} w-full px-3 py-3 rounded-sm font-modelica-bold text-xl shadow-inner bg-black/20 border-fuchsia-500 font-modelica-medium focus-visible:outline-none`}
                        id="bid-amount"
                        type="number"
                        value={bidAmount}
                        onChange={handleBidAmountChange.bind(this)}
                    />
                    <Image src="/eth_symbol.svg" alt="So Extra" width="40" height="230" className="absolute right-1 top-2.5" />
                </div>
            </div>
            <div className="pl-2 text-center items-center flex gap-4 w-1/2 mt-auto">
                {!walletAddress &&
                    <PostConnectButton />
                }

                {(useBurner && walletAddress ? burnerAccount !== undefined && signedTx === undefined : walletAddress !== undefined && signedTx === undefined) && (
                    <button
                        onClick={handleButtonClick}
                        disabled={signedTx !== undefined || bidAmountError !== undefined}
                        type="submit"
                    >
                        <LottiePlayer src={SignButton} />
                    </button>
                )}
                {(useBurner ? burnerAccount !== undefined && signedTx : walletAddress !== undefined && signedTx) && (
                    <button
                        onClick={handleButtonClickForSignedTx}
                        disabled={signedTx === undefined || rigilTxReceipt !== undefined}
                        type="submit"
                    >
                        <LottiePlayer src={SubmitButton} />
                    </button>
                )}
            </div>
        </div>
    </div>
}

export default BlockBid