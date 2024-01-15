import { ReactNode, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import BurnerWallet from '../components/BurnerWallet';
import LeaderBoard from '../components/LeaderBoard';
import Image from 'next/image';
import Faq from '../components/Faq';
import Onboarding from "./Onboarding";
import ActiveBids from "./ActiveBids";

export default function Layout({ pageProps, children }: { pageProps?: any, children: ReactNode }) {
    const [useBurner, setUseBurner] = useState<boolean>(false)

    const { suaveClient, rigil } = useSuave()

    const { address: walletAddress } = useAccount()

    const { data: balance } = useBalance({
        address: walletAddress
    })

    const { data: rigilBalance } = useBalance({ address: walletAddress, chainId: rigil.id })

    const {
        account: burnerAccount,
        balance: burnerBalance,
        rigilBalance: burnerRigilBalance,
        privateKey: burnerPrivateKey,
        createBurnerWallet
    } = useBurnerWallet()

    const [signedTx, setSignedTx] = useState<`0x${string}` | undefined>(undefined)

    return (
        <div className="bg-purple-950 text-white bg-[url('/bck.jpg')] min-h-screen">
            <Head>
                <title>So Extra</title>
                <meta
                    name="description"
                    content="Check out the first suave app! Extra data is for sale on Goerli. Read and post 32-byte messages using block extra data"
                    key="desc"
                />
                <meta property="og:title" content="So Extra" />
                <meta
                    property="og:description"
                    content="Check out the first suave app! Extra data is for sale on Goerli. Read and post 32-byte messages using block extra data"
                />
                <meta
                    property="og:image"
                    content="https://so-extra-dapp.vercel.app/logo.png"
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:site" content="so-extra" />
                <link href="/favicon.ico" rel="icon" />
                <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <main>
                <div className="w-full flex flex-row gap-4 justify-between items-end mb-0 pt-3 px-4">
                    <div className="flex-1 max-w-sm hidden md:block -mb-[30px]">
                        {/* <div className="flex place-content-end"> */}
                        {/* <Image src="/a.png" alt="So Extra" width="184" height="184" className="flex hover:animate-bounce" /> */}
                        {/* <Image src="/b.png" alt="So Extra" width="808" height="519" className="hover:animate-bounce" /> */}
                        <Image src="/c.png" alt="So Extra" width="282" height="230" className="hover:animate-bounce" />
                        {/* </div> */}
                    </div>
                    <div className="flex-1 max-w-2xl justify-center h-[110px]">
                        {/* <div className="place-content-center">
                            <div className="-mb-[80px] md:-mb-[0px] h-[100px]">
                                <Image
                                    src="/logo.png"
                                    alt="So Extra"
                                    width="560"
                                    height="201"
                                    className="object-contain h-[150px] w-[560px] mx-auto"
                                />
                            </div>
                        </div> */}
                    </div>
                    <div className="flex-1 max-w-sm hidden md:block justify-items-end -mb-8 pr-6">
                        <div className="flex place-content-end">
                            <ConnectButton />
                        </div>
                    </div>
                </div>

                <div>
                    <hr className="bg-red-500 w-full h-1 border-0 my-0" />
                    <hr className="bg-orange-400 w-full h-1 border-0 my-0" />
                    <hr className="bg-yellow-300 w-full h-1 border-0 my-0" />
                    <hr className="bg-lime-400 w-full h-1 border-0 my-0" />
                    <hr className="bg-cyan-400 w-full h-1 border-0 my-0" />
                    <hr className="bg-blue-600 w-full h-1 border-0 my-0" />
                    <hr className="bg-indigo-700 w-full h-1 border-0 my-0" />
                </div>

                <div className="flex flex-row gap-4 justify-center items-start md:p-4 min-h-screen">
                    <div className="flex-1 max-w-sm hidden md:block">
                        <div className="flex flex-col gap-12 items-center">
                            <div className="flex-1 w-full">
                                <Wallets useBurner={useBurner} setUseBurner={setUseBurner} />
                                <Steps
                                    isConnected={useBurner ? burnerAccount !== undefined : walletAddress !== undefined}
                                    isGoerliBalance={useBurner ? (burnerBalance !== undefined && burnerBalance.value > BigInt(0)) : (balance !== undefined && balance.value > BigInt(0))}
                                    isRigilBalance={useBurner ? (burnerRigilBalance !== undefined && burnerRigilBalance.value > BigInt(0)) : (rigilBalance !== undefined && rigilBalance.value > BigInt(0))}
                                    isSignedTx={signedTx !== undefined}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <BurnerWallet />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 max-w-2xl justify-center">
                        <div className="flex flex-col">
                            <div className="flex-1 w-full mb-6 md:mb-0">
                                <div className="relative place-content-center">
                                    <div className="absolute -bottom-[45px] lg:-bottom-[30px] p-5">
                                        <Image
                                            src="/logo.png"
                                            alt="So Extra"
                                            width="560"
                                            height="201"
                                            className="object-contain h-[150px] w-[560px] mx-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex-1 w-full">
                                    <BlockBid useBurner={useBurner} setUseBurner={setUseBurner} />
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm hidden md:block">
                        <div className="flex flex-col gap-12">
                            <div className="flex-1 w-full">
                                <Onboarding />
                            </div>
                            <div className="flex-1 w-full">
                                <LeaderBoard />
                            </div>
                            <div className="flex-1 w-full">
                                <ActiveBids />
                            </div>
                            <div className="flex-1 w-full">
                                <Faq />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div>
                <hr className="bg-red-500 w-full h-1 border-0 my-0" />
                <hr className="bg-orange-400 w-full h-1 border-0 my-0" />
                <hr className="bg-yellow-300 w-full h-1 border-0 my-0" />
                <hr className="bg-lime-400 w-full h-1 border-0 my-0" />
                <hr className="bg-cyan-400 w-full h-1 border-0 my-0" />
                <hr className="bg-blue-600 w-full h-1 border-0 my-0" />
                <hr className="bg-indigo-700 w-full h-1 border-0 my-0" />
            </div>

            <footer className="p-6 text-center">
                <a href="https://twitter.com/MihaLotric" rel="noopener noreferrer" target="_blank">
                    @MihaLotric
                </a>
            </footer>
        </div>
    )
}