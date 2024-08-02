import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { getAddress, createWalletClient, custom, Chain, ChainFormatters, hexToSignature, keccak256, parseEther, parseTransaction, serializeTransaction, stringToBytes, parseAbiItem, encodeFunctionData, TransactionReceipt, TransactionRequest, TransactionSerializedLegacy, Hash } from "viem"
import { useBalance, useBlockNumber, useConnectorClient, usePrepareTransactionRequest } from "wagmi"
import { ConfidentialComputeRequest, ConfidentialComputeRecord } from 'ethers-suave'
import useBurnerWallet from "../hooks/useBurnerWallet"
import useSuave from "../hooks/useSuave"
import { PrivateKeyAccount } from "viem"
import { executionNodes, suaveContractAddress } from "../lib/Deployments"
import Image from "next/image"
import SignButton from '../public/lotties/signButton.json'
import SubmitButton from '../public/lotties/submitButton.json'
import { PostConnectButton } from "./PostConnectButton"
import LottiePlayer from "./LottiePlayer"
import {
  type TransactionRequestSuave
} from '@flashbots/suave-viem/chains/utils';
import useCustomChains from "../hooks/useCustomChains"

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
    const [extraData, setExtraData] = useState<string>("So Extra ✨")
    const [bytesLength, setBytesLength] = useState<number>(12)
    const {
        balance: burnerBalance,
        privateKey: burnerPrivateKey,
    } = useBurnerWallet()

    const { l1Chain: chain } = useCustomChains()
    // const { chain } = useAccount()
    const { suaveBurnerWallet, suaveProvider } = useSuave()

    const MAX_BYTES_LENGTH = 32
    const BID_VALID_FOR_BLOCKS = BigInt(100)

    const [bidAmount, setBidAmount] = useState<number>(0.25)
    const [gasPrice, setGasPrice] = useState<bigint>(gasPriceForBidAmount(bidAmount))

    const [errorMessage, setErrorMessage] = useState<string>()

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

    const { data: walletClient } = useConnectorClient()

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

    const { data: currentL1Block } = useBlockNumber({ chainId: chain.id })

    const { data: request } = usePrepareTransactionRequest({
        chainId: chain.id,
        account: useBurner ? burnerAccount : walletAddress,
        to: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress,
        gasPrice: gasPrice,
    })

    const handleButtonClick = async () => {
        setErrorMessage(undefined)
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }
        console.log('gas', gasPrice);
        try {
            // create request with viem
            // const request: TransactionRequest = await walletClient.prepareTransactionRequest({
            //     chainId: chain?.id,
            //     account: useBurner ? burnerAccount : walletAddress,
            //     to: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress,
            //     gasPrice: gasPrice,
            // })
            console.log("request", request)

            // augment request with chain id (required)
            // const augmentedTx = { ...request/*, chainId: chain?.id */}
            const requestTyped = request as unknown as TransactionRequest
            console.log("requestTyped", requestTyped)

            // @ts-expect-error
            const serialized = serializeTransaction(requestTyped)
            console.log("serialized", serialized)

            // ensure serialized tx is valid

            // @ts-expect-error
            const parsedTx: TransactionSerializedLegacy = parseTransaction(serialized)
            console.log(`parsedTx`, parsedTx)

            try {
                let serializedSignedTx;
                if (useBurner) {
                    // @ts-expect-error
                    serializedSignedTx = await burnerAccount?.signTransaction(requestTyped)
                }
                else {
                    const serializedHash = keccak256(serialized)
                    // sign with metamask (required advanced setting enabled)
                    const hexSignature = await (window as any).ethereum.request({ method: 'eth_sign', params: [walletAddress, serializedHash] })
                    const signature = hexToSignature(hexSignature)
                    // @ts-expect-error
                    serializedSignedTx = serializeTransaction(requestTyped, signature)
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

    const handleButtonClickForSignedTx = async () => {
        if (walletClient === undefined || walletClient === null) {
            console.error(`walletClient not found`)
            return
        }

        const abiItem = parseAbiItem(
            'function buyAd(uint64 blockLimit, string memory extra)',
        )

        // Public data
        const calldata = encodeFunctionData({
            abi: [abiItem],
            functionName: 'buyAd',
            args: [(currentL1Block || BigInt(0)) + BID_VALID_FOR_BLOCKS, extraData]
        })

        // Confidential data
        const confidentialBytes = txToBundleBytes(signedTx as `0x${string}`) as `0x${string}`

        const ccr: TransactionRequestSuave = {
            chainId: suaveProvider.chain.id,
            data: calldata,
            confidentialInputs: confidentialBytes,
            gas: BigInt(1e6),
            gasPrice: await suaveProvider.getGasPrice(),
            nonce: await suaveProvider.getTransactionCount({ address: burnerAccount !== undefined && useBurner ? burnerAccount.address : walletAddress! }),
            to: suaveContractAddress,
            value: BigInt(0),
            type: "0x43", // transaction type for Confidential Compute Request
            isEIP712: false, 
            kettleAddress: executionNodes[suaveProvider.chain.id]
        }

        var ccrRlp
        if (useBurner && suaveBurnerWallet !== undefined) {
            ccrRlp = await suaveBurnerWallet.signTransaction(ccr)
        } else {
            const crecord = new ConfidentialComputeRecord({...ccr, isEIP712: true})
            crecord.confidentialInputsHash = keccak256(ccr.confidentialInputs as `0x${string}`)
            const ccr2 = new ConfidentialComputeRequest(crecord, ccr.confidentialInputs)
   
            ccrRlp = await ccr2.signWithAsyncCallback(async (_hash: string) => {
                const hexSig = await signEIP712(ccr2)
                let sig = hexToSignature(hexSig)
                return { ...sig, v: Number(sig.v) } as any
            }).then(ccr => ccr.rlpEncode())
        }

        console.log("debug::ccr", ccr)
        console.log("debug::ccrRlp", ccrRlp)

        const hash: Hash = await suaveProvider.sendRawTransaction({
            //// BREAKS /////
            serializedTransaction: ccrRlp as `0x${string}`
        })

        console.log(`suave hash`, hash)
        setRigilTx(hash)

        // @ts-expect-error
        const receipt: TransactionReceipt = await suaveProvider.waitForTransactionReceipt({
            hash: hash
        })
        console.log(`suave receipt`, receipt)
        setRigilTxReceipt(receipt)
        console.log("suave receipt", rigilTxReceipt)
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

    return <div className="flex flex-col py-4 border border-white/30 bg-white/5 backdrop-blur-lg">
        <div className="relative px-4 my-2">
            <label
                className="font-light text-sm"
                htmlFor="extra-data"
            >{'Extra data'}
                <span className="text-white/70">{' '}&bull;{' '}Public Data</span>
            </label>
            <input
                className="border border-fuchsia-600 w-full px-3 py-3 rounded-sm text-white font-modelica-bold text-xl shadow-inner bg-black/20 font-modelica-medium focus-visible:outline-none mt-1"
                id="extra-data"
                type="text"
                value={extraData}
                onChange={handleExtraDataChange.bind(this)}
            />
            <p className="absolute right-7 bottom-1.5 text-sm text-center text-white/60">{
                bytesLength} / {MAX_BYTES_LENGTH}<br /> bytes
            </p>
        </div>
        <div className="px-4 flex">
            <div className="flex flex-col w-1/2">
                <label className="font-light text-sm" htmlFor="bid-amount">
                    {'Bid Amount'}
                    <span className="text-white/70">{' '}&bull;{' '}Confidential Data</span>
                </label>
                <div className="flex relative">
                    <input
                        className={`[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border mt-1 ${bidAmountError !== undefined ? `text-red-500` : `text-white`} w-full px-3 py-3 rounded-sm font-modelica-bold text-xl shadow-inner bg-black/20 border-fuchsia-500 font-modelica-medium focus-visible:outline-none`}
                        id="bid-amount"
                        type="number"
                        value={bidAmount}
                        onChange={handleBidAmountChange.bind(this)}
                    />
                    <Image src="/eth_symbol.svg" alt="So Extra" width="40" height="230" className="absolute right-1 top-2.5" />
                </div>
            </div>
            <div className="pl-2 text-center items-center flex gap-4 w-1/2 mt-auto">
                {!walletAddress &&
                    <PostConnectButton />
                }

                {(useBurner && walletAddress ? burnerAccount !== undefined && signedTx === undefined : walletAddress !== undefined && signedTx === undefined) && (
                    <button
                        onClick={handleButtonClick}
                        disabled={signedTx !== undefined || bidAmountError !== undefined}
                        type="submit"
                    >
                        <LottiePlayer src={SignButton} />
                    </button>
                )}
                {(useBurner ? burnerAccount !== undefined && signedTx : walletAddress !== undefined && signedTx) && (
                    <button
                        onClick={handleButtonClickForSignedTx}
                        disabled={signedTx === undefined || rigilTxReceipt !== undefined}
                        type="submit"
                    >
                        <LottiePlayer src={SubmitButton} />
                    </button>
                )}
            </div>
        </div>
    </div>
}

export default BlockBid


import {ethers} from 'ethers'

export function txToBundleBytes(signedTx): string {
	const bundle = txToBundle(signedTx)
	const bundleBytes = bundleToBytes(bundle)
	return bundleBytes
}

export function txToBundle(signedTx): IBundle {
	return {
		txs: [signedTx],
		revertingHashes: [],
	}
}

export function bundleToBytes(bundle: IBundle): string {
	const bundleBytes = Buffer.from(JSON.stringify(bundle), 'utf8')
	const confidentialDataBytes = ethers.AbiCoder.defaultAbiCoder().encode(['bytes'], [bundleBytes])
	return confidentialDataBytes
}

interface IBundle {
	txs: Array<string>,
	revertingHashes: Array<string>,
}

async function signEIP712(ccr: ConfidentialComputeRequest) {
    try {
        const crecord = ccr.confidentialComputeRecord
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const from = accounts[0];
        const msg = {
            nonce: crecord.nonce,
            gasPrice: Number(crecord.gasPrice),
            gas: Number(crecord.gas),
            to: crecord.to,
            value: crecord.value ?? 0,
            data: crecord.data,
            kettleAddress: crecord.kettleAddress,
            confidentialInputsHash: keccak256(ccr.confidentialInputs as `0x${string}`)
          }
        const msgParams = JSON.stringify({
          domain: {
            name: 'ConfidentialRecord',
            verifyingContract: crecord.kettleAddress,
          },
          message: msg,
          primaryType: 'ConfidentialRecord',
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'verifyingContract', type: 'address' },
            ],
            ConfidentialRecord: [
              { name: 'nonce', type: 'uint64' },
              { name: 'gasPrice', type: 'uint256' },
              { name: 'gas', type: 'uint64' },
              { name: 'to', type: 'address' },
              { name: 'value', type: 'uint256' },
              { name: 'data', type: 'bytes' },
              { name: 'kettleAddress', type: 'address' },
              { name: 'confidentialInputsHash', type: 'bytes32' },
            ],
          },
        });
    
        const result = await window.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [from, msgParams],
          from: from,
        });
    
        return result;
    
      } catch (error) {
        console.error('Error:', error);
      }
}