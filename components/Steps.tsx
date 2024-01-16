import { TransactionReceipt } from "viem"

const Steps = ({
    isConnected,
    isGoerliBalance,
    isRigilBalance,
    isSignedTx,
    rigilHash,
    rigilReceipt
}: {
    isConnected: boolean,
    isGoerliBalance: boolean,
    isRigilBalance: boolean,
    isSignedTx: boolean,
    rigilHash?: string | undefined
    rigilReceipt?: TransactionReceipt | undefined
}) => {
    const isRigilHash = rigilHash !== undefined
    const isMined = rigilReceipt !== undefined

    console.log("status", rigilReceipt?.status);


    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-rainbow-yellow">
                {'Prequisites'}
            </h2>
        </div>
        <div className="flex flex-col gap-2 p-3 text-sm">
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Connect Wallet
                    </p>
                    {isConnected && (
                        <p className="font-semibold text-fuchsia-500">
                            Completed
                        </p>
                    )}
                </div>
            </div>
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Get Goerli ETH
                    </p>
                    {isGoerliBalance ? (
                        <p className="font-semibold text-fuchsia-500">
                            Completed
                        </p>
                    ) : (
                        <p className="font-semibold text-fuchsia-500">
                            <a className="text-white underline hover:no-underline" href={`https://goerli-faucet.pk910.de/`} target="_blank">Faucet</a>
                        </p>
                    )}
                </div>
            </div>
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Get Rigil ETH
                    </p>
                    {isRigilBalance ? (
                        <p className="font-semibold text-fuchsia-500">
                            Completed
                        </p>
                    ) : (
                        <p className="font-semibold text-fuchsia-500">
                            <a className="text-white underline hover:no-underline" href={`https://faucet.rigil.suave.flashbots.net/`} target="_blank">Faucet</a>
                        </p>
                    )}
                </div>
            </div>
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Sign Bid (Goerli)
                    </p>
                    {isSignedTx && (
                        <p className="font-semibold text-fuchsia-500">
                            Completed
                        </p>
                    )}
                </div>
            </div>
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Submit SUAVE CCR (Rigil)
                    </p>
                    {isRigilHash && !isMined && (
                        <p className="font-semibold text-fuchsia-500">
                            <a className="text-neutral-500 underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Pending</a>
                        </p>
                    )}
                    {isRigilHash && rigilReceipt?.status === "success" && (
                        <p className="font-semibold text-fuchsia-500">
                            <a className="underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Completed</a>
                        </p>
                    )}
                    {isRigilHash && rigilReceipt?.status === "reverted" && (
                        <p className="font-semibold text-fuchsia-500">
                            <a className="text-red-500 underline hover:no-underline" href={`https://explorer.rigil.suave.flashbots.net/tx/${rigilHash}`} target="_blank">Error</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
}

export default Steps