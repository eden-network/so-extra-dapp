
import { Dispatch, SetStateAction } from "react"
import { useAccount, useBalance } from "wagmi"
import useBurnerWallet from "../hooks/useBurnerWallet"
import { CustomConnectButton } from "./CustomConnectButton"
import useSuave from "../hooks/useSuave"

const ellipsis = (str: string) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
}

const Wallets = ({
    useBurner
    , setUseBurner
}: {
    useBurner: boolean,
    setUseBurner: Dispatch<SetStateAction<boolean>>
}) => {

    const {
        account: burnerAccount,
        balance: burnerBalance,
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey,
        createBurnerWallet
    } = useBurnerWallet()

    const { suaveClient, rigil } = useSuave()


    const { address: walletAddress } = useAccount()

    const { data: balance } = useBalance({
        address: walletAddress
    })

    const { data: rigilBalance } = useBalance({ address: walletAddress, chainId: rigil.id })

    const handleButtonClickForCreateBurnerWallet = () => {
        createBurnerWallet()
        setUseBurner(true)
    }

    return (
        <>
            <div className="px-4 my-2">
                <h1 className="text-yellow-300 font-bold text-2xl text-center">Wallets</h1>
                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-white/80">Burner wallet</p>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">
                        {/* <p className="">Burner wallet</p> */}
                        {burnerAccount === undefined ? <button
                            className="w-[263px] h-[44px] rounded-full bg-[url('/create-button.png')] disabled:bg-[url('/create-button-disabled.png')] hover:bg-[url('/create-button-hover.png')]"
                            onClick={handleButtonClickForCreateBurnerWallet.bind(this)}
                            type="submit"
                        >
                            <p className="hidden">Create Burner Wallet</p>
                        </button> : <>
                            <p className="flex-1 mb-auto font-semibold text-xl">
                                <a href={`https://goerli.etherscan.io/address/${burnerAccount.address}`} target="_blank" className="hover:underline">
                                    {ellipsis(burnerAccount.address)}
                                </a>
                            </p>
                            <div>
                                {useBurner === true ? <p className="flex-0 text-base text-black bg-gray-400 px-6 py-1 rounded-full border border-fuchsia-500">Active</p> : <button
                                    className="flex-0 text-base bg-gray-500 px-6 py-1 rounded-full border border-fuchsia-500 text-black hover:no-underline disabled:text-gray-400 disabled:pointer disabled:underline"
                                    onClick={() => setUseBurner(true)}
                                    disabled={burnerAccount === undefined}
                                >
                                    {`Switch`}
                                </button>}
                                {burnerAccount !== undefined && <p
                                    className="flex flex-col text-xs mb-6 mt-2"
                                >
                                    <span>goerliETH: {burnerBalance !== undefined ? `${parseFloat(burnerBalance.formatted).toLocaleString()}` : `-`}</span>
                                    <span>rigilETH: {burnerRigilBalance !== undefined ? `${parseFloat(burnerRigilBalance.formatted).toLocaleString()}` : `-`}</span>
                                </p>}
                            </div>
                        </>}
                    </div>
                    <p className="text-sm mb-1">Metamask Wallet</p>
                    <div className="flex flex-row justify-between text-xs items-center gap-2 mb-1">
                        {/* <p className="">Wallet</p> */}
                        {walletAddress === undefined ? <CustomConnectButton isSmall={true} /> : <>
                            <p className="flex-1 font-semibold text-xl">
                                <a href={`https://goerli.etherscan.io/address/${walletAddress}`} target="_blank" className="hover:underline">
                                    {ellipsis(walletAddress)}
                                </a>
                            </p>
                            {useBurner === false ? <p className="flex-0 text-base text-black bg-gray-400 px-6 py-1 rounded-full border border-fuchsia-500">Active</p> : <button
                                className="flex-0 text-base bg-gray-500 px-6 py-1 rounded-full border border-fuchsia-500 text-black hover:no-underline disabled:text-gray-400 disabled:pointer disabled:underline"
                                onClick={() => setUseBurner(false)}
                                disabled={burnerAccount === undefined}
                            >
                                {`Switch`}
                            </button>}
                        </>}
                    </div>
                    {walletAddress !== undefined && <p
                        className="text-xs mb-6"
                    >Balances:
                        <span>{' '}{balance !== undefined ? `${parseFloat(balance.formatted).toLocaleString()}` : `-`} goerliETH</span>
                        <span>{' '}&bull;{' '}{rigilBalance !== undefined ? `${parseFloat(rigilBalance.formatted).toLocaleString()}` : `-`} rigilETH</span>
                    </p>}
                </div>
            </div >

        </>
    )
}

export default Wallets