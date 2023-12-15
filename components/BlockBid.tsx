import { useEffect, useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt, hexToString, stringToHex } from "viem"
import { useAccount, useBalance, useBlockNumber, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { goerli } from "viem/chains"
import Steps from "./Steps"

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
        privateKey: burnerPrivateKey
    } = useBurnerWallet()

    const { suaveClient, rigil } = useSuave()

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

    const handleButtonClickForSignedTx = async () => {
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        const contractAdd = '0xee9794177378e98268b30Ca14964f2FDFc71bD6D' as `0x${string}`
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
        //     to: contractAdd,
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
            to: contractAdd,
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
            <label
                className="font-semibold"
                htmlFor="extra-data"
            >Account</label>
            <input
                className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
                id="extra-data"
                type="text"
                value={burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress}
                readOnly
            />
            <p
                className="text-sm text-right"
            >
                <button
                    className="underline italic hover:no-underline disabled:text-gray-400 disabled:pointer disabled:underline"
                    onClick={() => setUseBurner(!useBurner)}
                    disabled={burnerAccount === undefined}
                >
                    {useBurner ? `Use wallet instead` : `Use burner instead`}
                </button>
            </p>
        </div>
        <div className="px-4 my-2">
            <label
                className="font-semibold"
                htmlFor="extra-data"
            >Message</label>
            <input
                className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
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
                className="font-semibold"
                htmlFor="bid-amount"
            >Bid Amount</label>
            <input
                className="border border-fuchsia-600 w-full px-4 py-3 rounded-sm text-white font-bold text-xl shadow-inner bg-black/20"
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
            {(useBurner ? burnerAccount === undefined : walletAddress === undefined) && (
                <button
                    className="px-8 py-4 text-lg rounded-full border-2 border-fuchsia-600 bg-neutral-200 hover:bg-white text-black disabled:bg-neutral-500"
                    onClick={handleButtonClick}
                    // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                    disabled={true}
                    type="submit"
                >
                    <p className="font-semibold">Connect Wallet</p>
                </button>
            )}
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