import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt, hexToString, stringToHex, toHex } from "viem"
import { useAccount, useBalance, useBlockNumber, usePublicClient, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { goerli } from "viem/chains"
import Steps from "./Steps"
import { PrivateKeyAccount } from "viem"
import { CustomConnectButton } from "./CustomConnectButton"
import { EventRequestIncluded, EventRequestRemoved, executionNodeAdd, suaveContractAddress, suaveDeployBlock } from "../lib/Deployments"

const ellipsis = (str: string) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
}

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
    // const [useBurner, setUseBurner] = useState<boolean>(false)
    const [extraData, setExtraData] = useState<string>("So Extra ✨")
    const [bytesLength, setBytesLength] = useState<number>(12)
    const {
        balance: burnerBalance,
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey,
        createBurnerWallet
    } = useBurnerWallet()

    const { suaveClient, rigil } = useSuave()

    // useEffect(() => {
    //     suaveClient.getLogs({
    //         address: suaveContractAddress,
    //         event: parseAbiItem('event RequestAdded(uint indexed id, string extra, uint blockLimit)'),
    //         fromBlock: suaveDeployBlock,
    //         toBlock: BigInt(10320182),
    //     }).then((r: any) => {
    //         ("event RequestAdded", r)
    //         // suaveClient.getTransaction({ hash: r.transactionHash }).then((x: any) => console.log(x))
    //     })
    // }, [suaveClient])

    // suaveClient.getBlock({
    //     blockHash: "0xbf51327c63fb3c8741d4233ae0315e3e1a74641532f4e59c307f72314a346235"
    // }).then((r: any) => console.log("debug", r))

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.25)
    const [gasPrice, setGasPrice] = useState<bigint>(gasPriceForBidAmount(bidAmount))

    const [errorMessage, setErrorMessage] = useState<string>()

    // const [rigilTx, setRigilTx] = useState<`0x${string}` | undefined>(undefined)
    // const [rigilTxReceipt, setRigilTxReceipt] = useState<TransactionReceipt | undefined>(undefined)

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
            // toBlock: BigInt(904377),
            strict: true
        }).then((r: any) => {
            console.log("event RequestIncluded", r)
        }).catch()
    }, [suaveClient])

    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: EventRequestRemoved,
            fromBlock: suaveDeployBlock,
            // toBlock: BigInt(904377),
            strict: true
        }).then((r: any) => {
            console.log("event RequestRemoved", r)
        }).catch()
    }, [suaveClient])

    const { data: rigilBalance } = useBalance({ address: walletAddress, chainId: rigil.id })
    // const { data: currentRigilBlock } = useBlockNumber({ chainId: rigil.id })
    const { data: currentGoerliBlock } = useBlockNumber({ chainId: goerli.id })

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

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

    const handleButtonClickForCreateBurnerWallet = () => {
        createBurnerWallet()
        setUseBurner(true)
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

        // const request = await suaveClient.prepareTransactionRequest({
        //     chain: rigil,
        //     chainId: rigil.id,
        //     account: address,
        //     to: suaveContractAddress,
        //     gasPrice: parseGwei('1'),
        //     gas: BigInt(1e7),
        //     data: calldata,
        // })
        // console.log(`request`, request)
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

    return <div className="flex flex-col py-4 border border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="relative px-4 my-2">
            <label
                className="font-light text-sm"
                htmlFor="extra-data"
            >{'Message'}<span className="text-white/70">{' '}&bull;{' '}Public Data</span></label>
            <input
                className="border border-fuchsia-600 w-full px-3 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                id="extra-data"
                type="text"
                value={extraData}
                onChange={handleExtraDataChange.bind(this)}
            />
            <p
                className="absolute right-7 bottom-1.5 text-sm text-center text-white/60"
            >{bytesLength} / {MAX_BYTES_LENGTH}<br /> bytes</p>
        </div>
        <div className="px-4 flex">
            <div className="flex flex-col w-1/2">
                <label
                    className="font-light text-sm"
                    htmlFor="bid-amount"
                >{'Bid Amount'}<span className="text-white/70">{' '}&bull;{' '}Confidential Data</span></label>
                <input
                    className={`border ${bidAmountError !== undefined ? `border-red-500` : `border-fuchsia-600`} w-full px-3 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20`}
                    id="bid-amount"
                    type="number"
                    value={bidAmount}
                    onChange={handleBidAmountChange.bind(this)}
                />
                {useBurner ?
                    (
                        <p
                            className={`text-sm text-right text-white/60 ${bidAmountError === "balance" && `text-red-500`}`}
                        >Balance:
                            <span>{' '}{burnerBalance !== undefined ? `${parseFloat(burnerBalance.formatted).toLocaleString()}` : `-`} goerli ETH</span>
                        </p>
                    ) : (
                        <p
                            className={`text-sm text-right text-white/60 ${bidAmountError === "balance" && `text-red-500`}`}
                        >Balance:
                            <span>{' '}{balance !== undefined ? `${parseFloat(balance.formatted).toLocaleString()}` : `-`} goerli ETH</span>
                        </p>
                    )}
            </div>
            <div className="pl-2 my-2 text-center items-center flex gap-4 w-1/2">
                {/* {walletAddress === undefined ? <button>connect to post</button> : <button
                    className="w-full px-8 py-4 text-xs rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                    onClick={handleButtonClick}
                    disabled={signedTx !== undefined || bidAmountError !== undefined}
                    type="submit"
                >
                    <p className="font-semibold">Step 1: Sign Bid for {bidAmount} ETH</p>
                </button>} */}
                {(useBurner ? burnerAccount !== undefined && signedTx === undefined : walletAddress !== undefined && signedTx === undefined) && (
                    <button
                        className="w-full px-8 py-4 text-xs rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                        onClick={handleButtonClick}
                        disabled={signedTx !== undefined || bidAmountError !== undefined}
                        type="submit"
                    >
                        <p className="font-semibold">Step 1: Sign Bid for {bidAmount} ETH</p>
                    </button>
                )}
                {(useBurner ? burnerAccount !== undefined && signedTx : walletAddress !== undefined && signedTx) && (
                    <button
                        className="px-8 py-1 text-xs rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                        onClick={handleButtonClickForSignedTx}
                        disabled={signedTx === undefined || rigilTxReceipt !== undefined}
                        type="submit"
                    >
                        <p className="font-semibold">Step 2: Submit Bid for {bidAmount} ETH</p>
                    </button>
                )}
            </div>
        </div>
        <p
            className="text-right text-white/60 px-6 text-xs"
        >Your bid is valid for the next {BID_VALID_FOR_BLOCKS.toString()} blocks</p>
        {errorMessage &&
            <p
                className="text-sm text-red-400"
            >Error: {errorMessage}</p>}
    </div>
}

export default BlockBid