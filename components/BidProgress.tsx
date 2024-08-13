import useCustomChains from "../hooks/useCustomChains"

const BidProgress = () => {
    const { l1Chain, suaveChain } = useCustomChains()
    return (
        <>
            <div className="flex">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-green-500 border border-4 border-green-500">
                        {l1Chain.name.slice(0, 2)}
                    </div>
                    <div className="w-1 h-4 bg-green-500"></div>
                    <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-green-500 border border-4 border-green-500">
                        {suaveChain.name.slice(0, 2)}
                    </div>
                    <div className="w-1 h-4 bg-green-500"></div>
                    <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-green-500 border border-4 border-green-500">
                        {suaveChain.name.slice(0, 2)}
                    </div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-white border border-4 border-white">
                        {l1Chain.name.slice(0, 2)}
                    </div>
                </div>
                <div className="flex flex-col justify-between ml-4">
                    <span className="text-green-500 text-sm mt-2">Signed on Holesky</span>
                    <span className="text-green-500 text-sm">Signed EIP712 message for CCR</span>
                    <span className="text-green-500 text-sm">SUAVE Tx confirmed</span>
                    <span className="text-white text-sm ">Waiting for block to be mined on Holesky...</span>
                </div>
            </div>
        </>
    )
}

export default BidProgress