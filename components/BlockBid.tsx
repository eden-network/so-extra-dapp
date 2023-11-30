import { useState } from "react"
import { parseEther, stringToBytes } from "viem"
import { useAccount, useBalance, useWalletClient } from "wagmi"

const BlockBid = () => {
    const [extraData, setExtraData] = useState<string>("")
    const [bytesLength, setBytesLength] = useState<number>(0)
    const MAX_BYTES_LENGTH = 32

    const [bidAmount, setBidAmount] = useState<number>(0.05)
    const [blockNumber, setBlockNumber] = useState<number>()

    const [signedTx, setSignedTx] = useState<string>()

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

    const handleBlockNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlockNumber(event.target.value as unknown as number)
    }

    const handleSignedTxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignedTx(event.target.value)
    }

    const { address, status } = useAccount()
    const {data: walletClient } = useWalletClient()

    const handleButtonClick = async () => {
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        const request = await walletClient.prepareTransactionRequest({
            account: address,
            to: address,
            value: parseEther(bidAmount.toString())
        })
        console.log(request)
        const signature = await walletClient.signTransaction(request)
        console.log(signature)
    }

    const handleButtonClickForSignedTx = async () => {
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        const hash = walletClient.sendRawTransaction({
            serializedTransaction: signedTx as `0x${string}`
        })
        console.log(hash)
    }

    const { data: balance } = useBalance({
        address
    })

    return <fieldset>
        <div>
            <label htmlFor="extra-data">Extra Data:</label>
            <input id="extra-data" type="text" value={extraData} onChange={handleExtraDataChange.bind(this)}></input>
            <p>{bytesLength} / {MAX_BYTES_LENGTH} bytes</p>
        </div>
        <div>
            <label htmlFor="block-number">Block number:</label>
            <input id="block-number" type="number" value={blockNumber} onChange={handleBlockNumberChange.bind(this)}></input>
        </div>
        <div>
            <label htmlFor="bid-amount">Bid Amount:</label>
            <input id="bid-amount" type="number" value={bidAmount} onChange={handleBidAmountChange.bind(this)}></input>
        </div>
        <div>
            <button onClick={handleButtonClick} type="submit">Bid {bidAmount} ETH</button>
        </div>
        <div>
            <p>{address}</p>
            <p>{status}</p>
            <p>{balance?.formatted} {balance?.symbol}</p>
        </div>
        <div>
            <label htmlFor="signed-tx">Signed Tx:</label>
            <input id="signed-tx" type="text" value={signedTx} onChange={handleSignedTxChange.bind(this)}></input>
        <div>
            <button onClick={handleButtonClickForSignedTx} type="submit">sendRawTransaction</button>
        </div>
        </div>
    </fieldset>
}

export default BlockBid