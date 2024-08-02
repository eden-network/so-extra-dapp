import { TransactionReceipt } from "viem"
import { CheckIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import Image from "next/image"

const Steps = ({
    isConnected,
    isL0Balance,
    isSuaveBalance,
    isSignedTx,
    rigilHash,
    rigilReceipt
}: {
    isConnected: boolean,
    isL0Balance: boolean,
    isSuaveBalance: boolean,
    isSignedTx: boolean,
    rigilHash?: string | undefined
    rigilReceipt?: TransactionReceipt | undefined
}) => {
    const isRigilHash = rigilHash !== undefined
    const isMined = rigilReceipt !== undefined

    const allCompleted: boolean = isConnected && isL0Balance && isSuaveBalance && isSignedTx && rigilReceipt ? true : false

    return <div className={`${allCompleted ? "hidden" : "flex"} flex flex-col pb-3 px-4`}>
        <div className="pt-2 pb-3 z-10">
            <h2 className="text-2xl text-center text-rainbow-yellow font-modelica-bold">
                {'Steps'}
            </h2>
        </div>
        <div className="flex flex-col gap-2 text-sm border border-white/30 p-2">
            <div className={`rounded-sm w-full backdrop-blur-lg p-1`}>
                <div className="flex">
                    <p className="flex-1">
                        STEP 1: Connect Wallet
                    </p>
                    {isConnected && (
                        <CheckIcon className="w-5 h-5 text-white" />
                    )}
                </div>
            </div>
            <div className={`rounded-sm w-full backdrop-blur-lg p-1`}>
                <div className="flex">
                    <p className="flex-1 ">
                        STEP 2: Get Holesky ETH
                    </p>
                    {isL0Balance ? (
                        <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                        <Link href={`https://cloud.google.com/application/web3/faucet/ethereum/holesky`} target="_blank">
                            <div className="flex gap-2 bg-white/10 text-white/30 border border-white/30 hover:border-white px-3 py-0.5 rounded">
                                <Image src={"/faucet.svg"} width={10} height={10} alt="faucet" />
                                <p className="text-white text-xs hover:no-underline">Faucet</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            <div className={`rounded-sm w-full backdrop-blur-lg p-1`}>
                <div className="flex">
                    <p className="flex-1 ">
                        STEP 3: Get Toliman ETH
                    </p>
                    {isSuaveBalance ? (
                        <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                        <Link href={`https://faucet.toliman.suave.flashbots.net/`} target="_blank">
                            <div className="flex gap-2 bg-white/10 text-white/30 border border-white/30 hover:border-white px-3 py-0.5 rounded">
                                <Image src={"/faucet.svg"} width={10} height={10} alt="faucet" />
                                <p className="text-white text-xs hover:no-underline">Faucet</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            <div className={`rounded-sm w-full backdrop-blur-lg p-1`}>
                <div className="flex">
                    <p className="flex-1 ">
                        STEP 4: Sign Bid (Holesky)
                    </p>
                    {isSignedTx && (
                        <CheckIcon className="w-5 h-5 text-white" />
                    )}
                </div>
            </div>
            <div className={`rounded-sm w-full backdrop-blur-lg p-1`}>
                <div className="flex">
                    <p className="flex-1 ">
                        STEP 5: Submit SUAVE CCR (Toliman)
                    </p>
                    {isRigilHash && !isMined && (
                        <p className=" text-white/30">
                            <a className="text-neutral-500 underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Pending</a>
                        </p>
                    )}
                    {isRigilHash && rigilReceipt?.status === "success" && (
                        <p className=" text-white/30">
                            <a className="underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Completed</a>
                        </p>
                    )}
                    {isRigilHash && rigilReceipt?.status === "reverted" && (
                        <p className=" text-white/30">
                            <a className="text-red-500 underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Error</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
}

export default Steps