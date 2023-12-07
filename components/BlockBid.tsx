import { useEffect, useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData } from "viem"
import { useAccount, useBalance, useBlockNumber, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { goerli } from "viem/chains"

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

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.25)
    const [gasPrice, setGasPrice] = useState<bigint>(gasPriceForBidAmount(bidAmount))

    const [unsignedTx, setUnsignedTx] = useState<string>("")
    const [signedTx, setSignedTx] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>()

    useEffect(() => {
        setSignedTx("")
    }, [bidAmount])

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

    useEffect(() => {
        console.log(currentBlock)
    }, [currentBlock])

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
            setUnsignedTx(serialized)

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
        
        const contractAdd = '0xa60F1B5cB70c0523A086BbCbe132C8679085ea0E' as `0x${string}`
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

        console.log(ccrRlp)
        const hash = await suaveClient.sendRawTransaction({
            serializedTransaction: ccrRlp as `0x${string}`
        })
        console.log(hash)
    }

    const { data: balance } = useBalance({
        address: walletAddress
    })

    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Bid
            </h2>
        </div>
        <div className="px-4 my-2">
            <label
                className="font-semibold"
                htmlFor="extra-data"
            >Account:</label>
            <input
                className="border w-full px-2 py-3 rounded-sm text-black font-bold text-xl shadow-inner"
                id="extra-data"
                type="text"
                value={burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress}
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
            >Extra Data:</label>
            <input
                className="border w-full px-2 py-3 rounded-sm text-black font-bold text-xl shadow-inner"
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
            >Bid Amount:</label>
            <input
                className="border w-full px-2 py-3 rounded-sm text-black font-bold text-xl shadow-inner"
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={handleBidAmountChange.bind(this)}
            />
            {useBurner ?
            <>
                <p
                    className="text-sm text-right px-3"
                >Burner Balance: {burnerBalance !== undefined ? `${burnerBalance.formatted}` : `-`} goerliETH</p>
                <p
                    className="text-sm text-right px-3"
                >{burnerRigilBalance !== undefined ? `${burnerRigilBalance.formatted}` : `-`} rigilETH</p>
                </>:<>
                <p
                    className="text-sm text-right px-3"
                >Wallet Balance: {balance !== undefined ? `${balance.formatted}` : `-`} goerliETH</p>
                <p
                    className="text-sm text-right px-3"
                >{rigilBalance !== undefined ? `${rigilBalance.formatted}` : `-`} rigilETH</p>
                </>}
        </div>
        <div className="px-4 my-2 text-center space-y-4">
            <button
                className="px-8 py-4 text-lg rounded-lg bg-[url('/glitter.png')] hover:opacity-99 text-white shadow-xl shadow-indigo-950/40 hover:shadow-none"
                onClick={handleButtonClick}
                type="submit"
            >
                <p className="font-bold glitter-shadow">Step 1: Sign Bid for {bidAmount} ETH</p>
            </button>
            <button
                className="px-8 py-4 text-lg rounded-lg bg-[url('/glitter.png')] hover:opacity-99 text-white shadow-xl shadow-indigo-950/40 hover:shadow-none"
                onClick={handleButtonClickForSignedTx}
                type="submit"
            >
                <p className="font-bold glitter-shadow">Step 2: Submit Bid for {bidAmount} ETH</p>
            </button>
            <p
                className="text-sm"
            >Your bid is valid for the next {BID_VALID_FOR_BLOCKS.toString()} blocks</p>
            {errorMessage && 
            <p
                className="text-sm"
            >Error: {errorMessage}</p>}
        </div>
        <div className="px-2 my-2">
            <p className="underline">Debug area</p>
            <p>Account: {walletAddress?.substring(0, 10)}...</p>
            <p>Burner: {burnerAccount?.address.substring(0, 10)}...</p>
            <p>Unsigned tx: {unsignedTx.substring(0, 10)}...</p>
            <p>Signed tx: {signedTx.substring(0, 10)}...</p>
        </div>
    </div>
}

export default BlockBid