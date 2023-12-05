import { useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes } from "viem"
import { useAccount, useBalance, useChainId, useNetwork, usePrepareSendTransaction, useWalletClient } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"

const BlockBid = () => {
    const [extraData, setExtraData] = useState<string>("")
    const [bytesLength, setBytesLength] = useState<number>(0)
    const { 
        account: burnerAccount,
        balance: burnerBalance
    } = useBurnerWallet()
    
    const MAX_BYTES_LENGTH = 32

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

    const { address, status } = useAccount()
    const { data: walletClient } = useWalletClient()
    const chainId = useChainId()
    const { chain } = useNetwork()

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        // create request with viem
        try {
            const request = await walletClient.prepareTransactionRequest({
                chain: chain,
                account: address,
                to: address,
                gasPrice: parseGwei('420'),
                value: parseEther(bidAmount.toString())
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

        const hash = await walletClient.sendRawTransaction({
            serializedTransaction: signedTx as `0x${string}`
        })
        console.log(hash)
    }

    const { data: balance } = useBalance({
        address
    })

    return <fieldset className="flex flex-col gap-2 max-w-md">
        <div>
            <label 
                className="mr-2"
                htmlFor="extra-data"
            >Account:</label>
            <input 
                className="border w-full px-1"
                id="extra-data"
                type="text"
                value={burnerAccount?.address}
            />
        </div>
        <div>
            <label 
                className="mr-2"
                htmlFor="extra-data"
            >Extra Data:</label>
            <input 
                className="border w-full px-1"
                id="extra-data"
                type="text" 
                value={extraData} 
                onChange={handleExtraDataChange.bind(this)}
            />
            <p
                className="text-sm text-right"
            >{bytesLength} / {MAX_BYTES_LENGTH} bytes</p>
        </div>
        <div>
            <label 
                className="mr-2"
                htmlFor="bid-amount"
            >Bid Amount:</label>
            <input
                className="border w-full px-1"
                id="bid-amount" 
                type="number" 
                value={bidAmount} 
                onChange={handleBidAmountChange.bind(this)}
            />
            <p
                className="text-sm text-right"
            >{balance !== undefined ? `${balance.formatted} ${balance.symbol}` : `Balance: - ETH` }</p>
        </div>
        <div>
            <button 
                className="bg-emerald-400 hover:bg-emerald-200 py-2 px-4 rounded w-full"
                onClick={handleButtonClick} 
                type="submit"
            >Step 1: Sign Tx for Bid {bidAmount} ETH</button>
            <p
                className="text-sm"
            >Your bid is valid for the next 100 blocks</p>
        </div>
        {errorMessage && <div>
            <p
                className=""
            >Error: {errorMessage}</p>
        </div>}
        <div>
            <p>Burner: {burnerAccount?.address}</p>
            <p>{burnerBalance?.formatted} {burnerBalance?.symbol}</p>
            <p>Account: {address}</p>
            <p>{status}</p>
            <p>{balance?.formatted} {balance?.symbol}</p>
            <p>Unsigned tx: {unsignedTx.substring(0, 10)}...</p>
            <p>Signed tx: {signedTx.substring(0, 10)}...</p>
        </div>
        <div>
            <label htmlFor="signed-tx">Signed Tx:</label>
            <input id="signed-tx" type="text" value={signedTx} onChange={handleSignedTxChange.bind(this)}></input>
            <div>
                <button 
                    className="bg-emerald-400 hover:bg-emerald-200 py-2 px-4 rounded w-full"
                    onClick={handleButtonClickForSignedTx} 
                    type="submit"
                >Step 2: Submit Signed Tx</button>
            </div>
        </div>
    </fieldset>
}

export default BlockBid