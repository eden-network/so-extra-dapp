import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt } from "viem"
import { useBalance, useBlockNumber, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave, { rigil } from "../hooks/useSuave"
import { goerli } from "viem/chains"
import { PrivateKeyAccount } from "viem"
import { EventRequestIncluded, EventRequestRemoved, executionNodeAdd, suaveContractAddress, suaveDeployBlock } from "../lib/Deployments"
import Image from "next/image"
import SignButton from '../public/lotties/signButton.json'
import SubmitButton from '../public/lotties/submitButton.json'
import { PostConnectButton } from "./PostConnectButton"
import LottiePlayer from "./LottiePlayer"
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

    const { suaveClient } = useSuave(rigil)

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

    const { data: walletClient } = useWalletClient()

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

    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: EventRequestIncluded,
            fromBlock: suaveDeployBlock,
            strict: true
        }).then((r: any) => {
            // console.log(r);
        }).catch()
    }, [suaveClient])

    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: EventRequestRemoved,
            fromBlock: suaveDeployBlock,
            strict: true
        }).then((r: any) => {
            console.log("event RequestRemoved", r)
        }).catch()
    }, [suaveClient])

    const { data: currentGoerliBlock } = useBlockNumber({ chainId: goerli.id })

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }
        console.log('gas', gasPrice);
        try {
            // create request with viem
            const request = await walletClient.prepareTransactionRequest({
                chain: goerli,
                account: useBurner ? burnerAccount : walletAddress,
                to: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress,
                gasPrice: gasPrice,
            })

            // augment with chain id (required)
            const augmentedTx = { ...request, chainId: goerli.id }
            const serialized = serializeTransaction(augmentedTx)

            // ensure serialized tx is valid
            const parsedTx = parseTransaction(serialized)
            console.log(`parsed tx`, parsedTx)

            try {
                let serializedSignedTx;
                if (useBurner) {
                    serializedSignedTx = await burnerAccount?.signTransaction(augmentedTx)
                }
                else {
                    const serializedHash = keccak256(serialized)
                    // sign with metamask (required advanced setting enabled)
                    const hexSignature = await (window as any).ethereum.request({ method: 'eth_sign', params: [walletAddress, serializedHash] })
                    const signature = hexToSignature(hexSignature)
                    serializedSignedTx = serializeTransaction(augmentedTx, signature)
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
        const calldata = encodeFunctionData({
            abi: [abiItem],
            functionName: 'buyAd',
            args: [(currentGoerliBlock || BigInt(0)) + BID_VALID_FOR_BLOCKS, extraData]
        })

        const suaveTx = {
            chainId: rigil.id,
            data: calldata,
            gasLimit: 1e7,
            gasPrice: parseGwei('1'),
            nonce: await suaveClient.getTransactionCount({ address: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress! }),
            to: suaveContractAddress,
            value: "0x"
        }
        console.log(`suave tx`, suaveTx)
        const confidentialBytes = txToBundleBytes(signedTx as `0x${string}`)
        const cRecord = createConfidentialComputeRecord(suaveTx as any, executionNodeAdd)
        const ccr = new ConfidentialComputeRequest(cRecord, confidentialBytes)
        var ccrRlp
        if (useBurner && burnerPrivateKey !== undefined) {
            ccrRlp = ccr.signWithPK(burnerPrivateKey.slice(2)).rlpEncode()
        } else {
            const signingCallback = async (_hash: string) => {
                const hexSig = await (window as any).ethereum.request({ method: 'eth_sign', params: [walletAddress, _hash] })
                const sig = hexToSignature(hexSig)
                return { r: sig.r, s: sig.s, v: Number(sig.v) } as SigSplit
            }
            ccrRlp = await ccr.signWithAsyncCallback(signingCallback).then(ccr => ccr.rlpEncode())
        }

        const hash = await suaveClient.sendRawTransaction({
            //// BREAKS /////
            serializedTransaction: ccrRlp as `0x${string}`
        })

        console.log(`rigil hash`, hash)
        setRigilTx(hash)
        const receipt = await suaveClient.waitForTransactionReceipt({
            hash: hash
        })
        console.log(`rigil receipt`, receipt)
        setRigilTxReceipt(receipt)
        console.log("rigil receipt", rigilTxReceipt)
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