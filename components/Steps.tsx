const Steps = ({
    isConnected,
    isGoerliBalance,
    isRigilBalance,
    isSignedTx,
    isRigilHash,
}: {
    isConnected: boolean,
    isGoerliBalance: boolean,
    isRigilBalance: boolean,
    isSignedTx: boolean,
    isRigilHash: boolean,
}) => {
    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Steps
            </h2>
        </div>
        <div className="flex flex-col gap-2 p-3 text-sm">
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Connect Wallet
                    </p>
                    {isConnected && (
                        <p className="font-semibold text-green-500">
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
                    {isGoerliBalance && (
                        <p className="font-semibold text-green-500">
                            Completed
                        </p>
                    )}
                </div>
            </div>
            <div className="border border-white/10 rounded-sm w-full bg-white/5 backdrop-blur-lg">
                <div className="flex p-4">
                    <p className="flex-1 font-semibold">
                        Get Rigil ETH
                    </p>
                    {isRigilBalance && (
                        <p className="font-semibold text-green-500">
                            Completed
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
                        <p className="font-semibold text-green-500">
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
                    {isRigilHash && (
                        <p className="font-semibold text-green-500">
                            Completed
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
}

export default Steps