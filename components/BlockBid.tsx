import { useState } from "react"

const BlockBid = () => {
    const [extraData, setExtraData] = useState<string>("")
    const [bidAmount, setBidAmount] = useState<number>(0.5)
    const [blockNumber, setBlockNumber] = useState<number>()

    const handleExtraDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtraData(event.target.value)
    }

    const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(event.target.value as unknown as number)
    }

    const handleBlockNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBlockNumber(event.target.value as unknown as number)
    }

    return <fieldset>
        <div>
            <label htmlFor="extra-data">Extra Data</label>
            <input id="extra-data" type="text" value={extraData} onChange={handleExtraDataChange.bind(this)}></input>
        </div>
        <div>
            <label htmlFor="block-number">Block number</label>
            <input id="block-number" type="number" value={blockNumber} onChange={handleBlockNumberChange.bind(this)}></input>
        </div>
        <div>
            <label htmlFor="bid-amount">Bid Amount</label>
            <input id="bid-amount" type="number" value={bidAmount} onChange={handleBidAmountChange.bind(this)}></input>
        </div>
        <div>
            <button type="submit">Bid {bidAmount} ETH</button>
        </div>
    </fieldset>
}

export default BlockBid