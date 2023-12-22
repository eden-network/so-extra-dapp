import { useEffect, useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt, hexToString, stringToHex, toHex } from "viem"
import { useAccount, useBalance, useBlockNumber, usePublicClient, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { goerli } from "viem/chains"
import Steps from "./Steps"
import { CustomConnectButton } from "./CustomConnectButton"

const suaveContractAddress: `0x${string}` = "0x07e60844bCd83B78b1991A3228E749B09AF9E215"

const ellipsis = (str: string) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
}

const gasPriceForBidAmount = (bidAmount: number): bigint => {
    const bidAmountBigInt = parseEther(bidAmount.toString())
    const gasLimit = BigInt(21_000)
    return bidAmountBigInt / gasLimit
}

const BlockBid = () => {
    const [useBurner, setUseBurner] = useState<boolean>(false)
    const [extraData, setExtraData] = useState<string>("So Extra ✨")
    const [bytesLength, setBytesLength] = useState<number>(12)
    const {
        account: burnerAccount,
        balance: burnerBalance,
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey,
        createBurnerWallet
    } = useBurnerWallet()

    const { suaveClient, rigil } = useSuave()

    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: parseAbiItem('event RequestAdded(uint indexed id, string extra, uint blockLimit)'),
            fromBlock: BigInt(687029),
            toBlock: BigInt(777563),
        }).then((r: any) => console.log("event RequestAdded", r))
    }, [suaveClient])

    // suaveClient.getBlock({
    //     blockHash: "0xbf51327c63fb3c8741d4233ae0315e3e1a74641532f4e59c307f72314a346235"
    // }).then((r: any) => console.log("debug", r))

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.25)
    const [gasPrice, setGasPrice] = useState<bigint>(gasPriceForBidAmount(bidAmount))

    const [signedTx, setSignedTx] = useState<`0x${string}` | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string>()

    const [rigilTx, setRigilTx] = useState<`0x${string}` | undefined>(undefined)
    const [rigilTxReceipt, setRigilTxReceipt] = useState<TransactionReceipt | undefined>(undefined)

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

    const { address: walletAddress } = useAccount()
    const { data: walletClient } = useWalletClient()

    const publicClient = usePublicClient()
    useEffect(() => {
        suaveClient.getLogs({
            address: suaveContractAddress,
            event: parseAbiItem('event RequestIncluded(uint indexed id, uint64 egp, string blockHash)'),
            fromBlock: BigInt(687029),
            toBlock: BigInt(777563)
        }).then((r: any) => {
            console.log("event RequestIncluded", r)
            // r.forEach((x: any) => {
            //     const blockHash = x.topics[0]
            //     publicClient.getBlock({
            //         blockHash: blockHash
            //     }).then((b: any) => console.log("debug -> getBlock", b)).catch()
            // })
        }).catch()
    }, [suaveClient, walletClient])

    const { data: rigilBalance } = useBalance({ address: walletAddress, chainId: rigil.id })
    const { data: currentBlock } = useBlockNumber({ chainId: goerli.id })

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
                // maxFeePerGas: parseGwei('6900'), // todo 
                // maxPriorityFeePerGas: parseGwei('6900'), // todo
                // value: parseEther(bidAmount.toString()) // todo
            })

            // augment with chain id (required)
            const augmentedTx = { ...request, chainId: goerli.id }
            const serialized = serializeTransaction(augmentedTx)

            // ensure serialized tx is valid
            const tmp = parseTransaction(serialized)
            console.log(tmp)

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
            args: [(currentBlock || BigInt(0)) + BID_VALID_FOR_BLOCKS, extraData]
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
        console.log(`suaveTx`, suaveTx)
        const executionNodeAdd = '0x03493869959c866713c33669ca118e774a30a0e5'
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
        console.log(hash)
        setRigilTx(hash)
        const receipt = await suaveClient.waitForTransactionReceipt({
            hash: hash
        })
        console.log(receipt)
        setRigilTxReceipt(receipt)
    }

    const { data: balance } = useBalance({
        address: walletAddress
    })

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Post a Message
            </h2>
        </div>
        <div className="px-4 my-2">
            <div className="flex flex-col">
                <p className="text-sm mb-1">Burner wallet</p>
                <div className="flex flex-row justify-between text-xs items-center gap-2 mb-6">
                    {/* <p className="">Burner wallet</p> */}
                    {burnerAccount === undefined ? <button
                        className="w-[263px] h-[44px] rounded-full bg-[url('/create-button.png')] disabled:bg-[url('/create-button-disabled.png')] hover:bg-[url('/create-button-hover.png')]"
                        onClick={handleButtonClickForCreateBurnerWallet.bind(this)}
                        type="submit"
                    >
                        <p className="hidden">Create Burner Wallet</p>
                    </button> : <>
                        <p className="flex-1 font-semibold text-xl">
                            <a href={`https://goerli.etherscan.io/address/${burnerAccount.address}`} target="_blank" className="hover:underline">
                                {ellipsis(burnerAccount.address)}
                            </a>
                        </p>
                        {useBurner === true ? <p className="flex-0 font-semibold text-base text-fuchsia-500">Active</p> : <button
                            className="flex-0 text-base underline italic hover:no-underline disabled:text-gray-400 disabled:pointer disabled:underline"
                            onClick={() => setUseBurner(true)}
                            disabled={burnerAccount === undefined}
                        >
                            {`Switch`}
                        </button>}
                    </>}
                </div>
                <p className="text-sm mb-1">Wallet</p>
                <div className="flex flex-row justify-between text-xs items-center gap-2 mb-6">
                    {/* <p className="">Wallet</p> */}
                    {walletAddress === undefined ? <CustomConnectButton isSmall={true} /> : <>
                        <p className="flex-1 font-semibold text-xl">
                            <a href={`https://goerli.etherscan.io/address/${walletAddress}`} target="_blank" className="hover:underline">
                                {ellipsis(walletAddress)}
                            </a>
                        </p>
                        {useBurner === false ? <p className="flex-0 font-semibold text-base text-fuchsia-500">Active</p> : <button
                            className="flex-0 text-base underline italic hover:no-underline disabled:text-gray-400 disabled:pointer disabled:underline"
                            onClick={() => setUseBurner(false)}
                            disabled={burnerAccount === undefined}
                        >
                            {`Switch`}
                        </button>}
                    </>}

                </div>
            </div>
        </div>
        <div className="px-4 my-2">
            <label
                className="font-light text-sm"
                htmlFor="extra-data"
            >Message</label>
            <input
                className="border border-fuchsia-600 w-full px-3 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                id="extra-data"
                type="text"
                value={extraData}
                onChange={handleExtraDataChange.bind(this)}
            />
            <p
                className="text-sm text-right"
            >{bytesLength} / {MAX_BYTES_LENGTH} bytes</p>
        </div>
        <div className="px-4 my-2">
            <label
                className="font-light text-sm"
                htmlFor="bid-amount"
            >Bid Amount</label>
            <input
                className="border border-fuchsia-600 w-full px-3 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={handleBidAmountChange.bind(this)}
            />
            {useBurner ?
                (
                    <p
                        className="text-sm text-right"
                    >Balances:
                        <span>{' '}{burnerBalance !== undefined ? `${burnerBalance.formatted}` : `-`} goerliETH</span>
                        <span>{' '}{burnerRigilBalance !== undefined ? `${burnerRigilBalance.formatted}` : `-`} rigilETH</span>
                    </p>
                ) : (
                    <p
                        className="text-sm text-right"
                    >Balances:
                        <span>{' '}{balance !== undefined ? `${parseFloat(balance.formatted).toLocaleString()}` : `-`} goerliETH</span>
                        <span>{' '}{rigilBalance !== undefined ? `${parseFloat(rigilBalance.formatted).toLocaleString()}` : `-`} rigilETH</span>
                    </p>
                )}
        </div>
        <div className="px-4 my-2 text-center space-y-4">
            {(useBurner ? burnerAccount !== undefined : walletAddress !== undefined) && (
                <button
                    className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                    onClick={handleButtonClick}
                    disabled={signedTx !== undefined}
                    type="submit"
                >
                    <p className="font-semibold">Step 1: Sign Bid for {bidAmount} ETH</p>
                </button>
            )}
            {(useBurner ? burnerAccount !== undefined : walletAddress !== undefined) && (
                <button
                    className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                    onClick={handleButtonClickForSignedTx}
                    disabled={signedTx === undefined}
                    type="submit"
                >
                    <p className="font-semibold">Step 2: Submit Bid for {bidAmount} ETH</p>
                </button>
            )}
            <p
                className="text-sm"
            >Your bid is valid for the next {BID_VALID_FOR_BLOCKS.toString()} blocks</p>
            {errorMessage &&
                <p
                    className="text-sm"
                >Error: {errorMessage}</p>}
        </div>
        <Steps
            isConnected={useBurner ? burnerAccount !== undefined : walletAddress !== undefined}
            isGoerliBalance={useBurner ? (burnerBalance !== undefined && burnerBalance.value > BigInt(0)) : (balance !== undefined && balance.value > BigInt(0))}
            isRigilBalance={useBurner ? (burnerRigilBalance !== undefined && burnerRigilBalance.value > BigInt(0)) : (rigilBalance !== undefined && rigilBalance.value > BigInt(0))}
            isSignedTx={signedTx !== undefined}
            rigilHash={rigilTx}
            rigilReceipt={rigilTxReceipt}
        />
    </div>
}

export default BlockBid