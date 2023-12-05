import { useState } from "react"
import { Transaction, hexToSignature, keccak256, parseEther, parseGwei, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, Chain } from "viem"
import { useAccount, useBalance, useChainId, useNetwork, usePrepareSendTransaction, useWalletClient } from "wagmi"
import { createConfidentialComputeRecord, txToBundleBytes } from '../ethers-suave/src/utils'
import { ConfidentialComputeRequest, SigSplit } from '../ethers-suave/src/confidential-types'
import useBurnerWallet from "../hooks/useBurnerWallet"
import Image from 'next/image'

const BlockBid = () => {
    const USING_BURNER = true
    const [extraData, setExtraData] = useState<string>("")
    const [bytesLength, setBytesLength] = useState<number>(0)
    const {
        account: burnerAccount,
        balance: burnerBalance,
        privateKey: burnerPrivateKey
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
        // const c: Chain = { id: 16813125, name: 'Rigil', rpcUrls: {default: {http: ['https://rpc.rigil.suave.flashbots.net']}}, nativeCurrency: { name: 'rig', symbol: 'SUAVE', decimals: 18 } }
        // await walletClient.addChain({chain: c})
        const RIGIL_CHAIN_ID = 16813125
        walletClient.switchChain({ id: RIGIL_CHAIN_ID })
        const contractAdd = '0xa60F1B5cB70c0523A086BbCbe132C8679085ea0E' as `0x${string}`
        const blockLimit = BigInt(100)
        
        const abiItem = parseAbiItem(
            'function buyAd(uint64 blockLimit, string memory extra)',
        )
        const calldata = encodeFunctionData({
            abi: [abiItem],
            functionName: 'buyAd',
            args: [blockLimit, extraData]
          })

        const request = await walletClient.prepareTransactionRequest({
            chain,
            account: address,
            to: contractAdd,
            gasPrice: parseGwei('420'),
            value: parseEther(bidAmount.toString()), 
            gas: BigInt(1e7),
        })
        const suaveTx = {
            chainId: request.chain?.id,
            data: calldata,
            gasLimit: 1e7,
            gasPrice: BigInt(1e9),
            nonce: request.nonce,
            to: contractAdd,
        }
        const executionNodeAdd = '0x03493869959c866713c33669ca118e774a30a0e5'
        const confidentialBytes = txToBundleBytes(signedTx as `0x${string}`)
        const cRecord = createConfidentialComputeRecord(suaveTx as any, executionNodeAdd)
        const ccr = new ConfidentialComputeRequest(cRecord, confidentialBytes)
        var ccrRlp
        if (USING_BURNER && burnerAccount && burnerPrivateKey) {
            ccrRlp = ccr.signWithPK(burnerPrivateKey.slice(2)).rlpEncode()
        } else {
            const signingCallback = async (_hash: string) => {
                const hexSig = await (window as any).ethereum.request({ method: 'eth_sign', params: [address, _hash] })
                const sig = hexToSignature(hexSig)
                return { r: sig.r, s: sig.s, v: Number(sig.v)  } as SigSplit
            }
            ccrRlp = await ccr.signWithAsyncCallback(signingCallback).then(ccr => ccr.rlpEncode())
        }
        
        console.log(ccrRlp)
        const hash = await walletClient.transport.request({ method: 'eth_sendRawTransaction', params: [ccrRlp] })
            .catch((error: any) => {
                console.log(error)
            })
        // const hash = await walletClient.sendRawTransaction({
        //     serializedTransaction: ccrRlp as `0x${string}`
        // })
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