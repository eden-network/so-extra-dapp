import useCustomChains from "../hooks/useCustomChains"

const BidProgress = () => {
    const { l1Chain, suaveChain } = useCustomChains()
    return (
        <>
            <div className="flex items-center">
                <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-white border border-4 border-white">
                    {l1Chain.name.slice(0,2)}
                </div>
                <div className="w-4 h-1 bg-white">
                </div>
                <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-white border border-4 border-white">
                    {suaveChain.name.slice(0,2)}
                </div>
                <div className="w-4 h-1 bg-white">
                </div>
                <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-white border border-4 border-white">
                    {suaveChain.name.slice(0,2)}
                </div>
                <div className="w-4 h-1 bg-white">
                </div>
                <div className="flex justify-center items-center w-9 h-9 bg-transparent rounded-full text-white border border-4 border-white">
                    {l1Chain.name.slice(0,2)}
                </div>
            </div>
        </>
    )
}

export default BidProgress