import { useState } from "react"
import { hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes } from "viem"
import { useAccount, useBalance, useChainId, useNetwork, useWalletClient } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from 'next/image'

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

    return <div className="flex flex-col">
        <div>
            <label
                className="mr-2"
                htmlFor="extra-data"
            >Account:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="extra-data"
                type="text"
                value={address}
            />
        </div>
        <div>
            <label
                className="mr-2"
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
                className="text-sm text-right"
            >{bytesLength} / {MAX_BYTES_LENGTH} bytes</p>
        </div>
        <div>
            <label
                className="mr-2"
                htmlFor="bid-amount"
            >Bid Amount:</label>
            <input
                className="border w-full px-3 py-1 rounded-full"
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={handleBidAmountChange.bind(this)}
            />
            <p
                className="text-sm text-right"
            >{balance !== undefined ? `${balance.formatted} ${balance.symbol}` : `Balance: - ETH`}</p>
        </div>
        <div>
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
            <div>
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
            </div>
        </div>
        <div>
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