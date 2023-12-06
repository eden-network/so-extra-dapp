import { useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, createPublicClient, http } from "viem"
import { useAccount, useBalance, useChainId, useNetwork, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from 'next/image'
import useSuave from "../hooks/useSuave"

const BlockBid = () => {
    const [useBurner, setUseBurner] = useState<boolean>(false)
    const [extraData, setExtraData] = useState<string>("")
    const [bytesLength, setBytesLength] = useState<number>(0)
    const {
        account: burnerAccount,
        balance: burnerBalance,
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey
    } = useBurnerWallet()

    const { suaveClient, rigil } = useSuave()

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.05)

    const [unsignedTx, setUnsignedTx] = useState<string>("")
    const [signedTx, setSignedTx] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>()

    const handleExtraDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value
        const bytes = stringToBytes(text)
        if (bytes.length <= MAX_BYTES_LENGTH) {
            setBytesLength(bytes.length)
            setExtraData(event.target.value)
        }
    }

    const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(event.target.value as unknown as number)
    }

    const handleSignedTxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignedTx(event.target.value)
    }

    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()
    const chainId = useChainId()
    const { chain } = useNetwork()

    const { data: rigilBalance } = useBalance({ address, chainId: rigil.id })

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        try {
            // create request with viem
            const request = await walletClient.prepareTransactionRequest({
                chain: chain,
                account: address,
                to: address,
                maxBaseFee: parseGwei('420'), // todo 
                maxPriorityFee: parseGwei('420'), // todo
                value: parseEther(bidAmount.toString()) // todo
            })

            // augment with chain id (required)
            const augmentedTx = { ...request, chainId }
            const serialized = serializeTransaction(augmentedTx)
            setUnsignedTx(serialized)

            // ensure serialized tx is valid
            const tmp = parseTransaction(serialized)
            console.log(tmp)

            // sign with metamask (required advanced setting enabled)
            try {
                const serializedHash = keccak256(serialized)
                const hexSignature = await (window as any).ethereum.request({ method: 'eth_sign', params: [address, serializedHash] })
                const signature = hexToSignature(hexSignature)
                const serializedSignedTx = serializeTransaction(augmentedTx, signature)
                setSignedTx(serializedSignedTx)
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
            args: [BID_VALID_FOR_BLOCKS, extraData]
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
            nonce: await suaveClient.getTransactionCount({ address }),
            to: contractAdd,
        }
        console.log(`suaveTx`, suaveTx)
        const executionNodeAdd = '0x03493869959c866713c33669ca118e774a30a0e5'
        const confidentialBytes = txToBundleBytes(signedTx as `0x${string}`)
        const cRecord = createConfidentialComputeRecord(suaveTx as any, executionNodeAdd)
        const ccr = new ConfidentialComputeRequest(cRecord, confidentialBytes)
        var ccrRlp
        if (useBurner && burnerAccount && burnerPrivateKey) {
            ccrRlp = ccr.signWithPK(burnerPrivateKey.slice(2)).rlpEncode()
        } else {
            const signingCallback = async (_hash: string) => {
                const hexSig = await (window as any).ethereum.request({ method: 'eth_sign', params: [address, _hash] })
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
        address
    })

    return <div className="flex flex-col pb-3">
        <div className="border-b pt-2 pb-3">
            <h2 className="text-2xl text-center font-semibold">
                Bid on a Block
            </h2>
        </div>
        <div className="px-2 my-2">
            <label
                className="px-3 font-semibold"
                htmlFor="extra-data"
            >Account:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="extra-data"
                type="text"
                value={burnerAccount !== undefined && useBurner ? burnerAccount.address : address}
            />
            <p
                className="text-sm text-right px-3"
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
        <div className="px-2 my-2">
            <label
                className="px-3 font-semibold"
                htmlFor="extra-data"
            >Extra Data:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="extra-data"
                type="text"
                value={extraData}
                onChange={handleExtraDataChange.bind(this)}
            />
            <p
                className="text-sm text-right px-3"
            >{bytesLength} / {MAX_BYTES_LENGTH} bytes</p>
        </div>
        <div className="px-2 my-2">
            <label
                className="px-3 font-semibold"
                htmlFor="bid-amount"
            >Bid Amount:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
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
        <div className="px-2 my-2">
            <button
                className="my-2 py-2 px-4 rounded-full w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-green-500 text-white"
                onClick={handleButtonClick}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <Image src={`/Group.png`} width="36" height="44" alt="So Extra" />
                    <p className="font-semibold">Step 1: Sign Bid for {bidAmount} ETH</p>
                </div>
            </button>
            <button
                className="my-2 py-2 px-4 rounded-full w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-green-500 text-white"
                onClick={handleButtonClickForSignedTx}
                type="submit"
            >
                <div className="flex flex-row items-center justify-center">
                    <Image src={`/Group.png`} width="36" height="44" alt="So Extra" />
                    <p className="font-semibold">Step 2: Submit Bid for {bidAmount} ETH</p>
                </div>
            </button>
            <p
                className="text-sm text-center"
            >Your bid is valid for the next {BID_VALID_FOR_BLOCKS.toString()} blocks</p>
        </div>
        {errorMessage &&
            <div className="px-2 my-2">
                <p
                    className="text-sm"
                >Error: {errorMessage}</p>
            </div>}
        <div className="px-2 my-2">
            <p className="underline">Debug area</p>
            <label htmlFor="signed-tx">Signed Tx:</label>
            <input id="signed-tx" type="text" value={signedTx} onChange={handleSignedTxChange.bind(this)}></input>
            <p>Burner: {burnerAccount?.address}</p>
            <p>{burnerBalance?.formatted} {burnerBalance?.symbol}</p>
            <p>Account: {address}</p>
            <p>Unsigned tx: {unsignedTx.substring(0, 10)}...</p>
            <p>Signed tx: {signedTx.substring(0, 10)}...</p>
        </div>
    </div>
}

export default BlockBid