import { ReactNode, useCallback, useEffect, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import LeaderBoard from '../components/LeaderBoard';
import Image from 'next/image';
import Onboarding from "./Onboarding";
import ActiveBids from "./ActiveBids";
import Wallets from "./Wallets";
import Steps from "./Steps";
import useSuave from "../hooks/useSuave";
import useBurnerWallet from "../hooks/useBurnerWallet";
import { useAccount, useBalance } from "wagmi";
import { TransactionReceipt } from "viem";
import { useRouter } from "next/router";
import HelpModal from "./Modal/HelpModal";
import localFont from 'next/font/local'
import Contributors from "./Contributors";
const Modelica = localFont({ src: '../public/fonts/modelica/woff2/BwModelica-Regular.woff2' })

export default function Layout({ pageProps, children }: { pageProps?: any, children: ReactNode }) {
    const [useBurner, setUseBurner] = useState<boolean>(false)

    const { suaveProvider } = useSuave()

    const { address: walletAddress } = useAccount()

    const { data: balance } = useBalance({
        address: walletAddress
    })

    const { data: suaveBalance } = useBalance({ address: walletAddress, chainId: suaveProvider.chain.id })

    const {
        account: burnerAccount,
        balance: burnerBalance,
        suaveBalance: burnerSuaveBalance,
    } = useBurnerWallet()

    const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
    const [showWinModal, setShowWinModal] = useState<boolean>(false);

    function toggleHelpModal() {
        setShowHelpModal(!showHelpModal);
    }

    function toggleWinModal() {
        setShowWinModal(!showWinModal);
    }

    const [suaveTxHash, setSuaveTxHash] = useState<`0x${string}` | undefined>(undefined)
    const [signedTx, setSignedTx] = useState<`0x${string}` | undefined>(undefined)

    const [suaveTxReceipt, setSuaveTxReceipt] = useState<TransactionReceipt | undefined>(undefined)

    const router = useRouter();
    const isHomePage = router.route === '/';

    return (
        <div className={`${Modelica.className} bg-stone-800 bg-[url('/background.svg')] text-white min-h-screen`}>
            <Head>
                <title>So Extra | Data Auction on SUAVE</title>
                <meta
                    name="description"
                    content="Check out the first Suave App! Extra data is for sale on Ethereum. Read and post 32-byte messages using block extra data"
                    key="desc"
                />
                <meta property="og:title" content="So Extra" />
                <meta
                    property="og:description"
                    content="Check out the first suave app! Extra data is for sale on Ethereum. Read and post 32-byte messages using block extra data"
                />
                <meta
                    property="og:image"
                    content="https://so-extra-dapp.vercel.app/logo.png"
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:site" content="so-extra" />
                <link rel="icon" type="image/png" href="/f64.png" />
                <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <main>
                <div className="w-full flex items-end mb-0 px-4 lg:pt-16">
                    <div className="flex-1 justify-center h-[110px]">
                        <div className="-mb-[80px] lg:-mb-[0px] h-[100px]">
                            <Image
                                onClick={toggleHelpModal}
                                src="/help.svg"
                                alt="help"
                                width="100"
                                height="201"
                                className="hidden lg:flex absolute cursor-pointer right-0 top-2 object-contain mx-auto"
                            />
                            <HelpModal showModal={showHelpModal} toggleModal={toggleHelpModal} />
                        </div>
                    </div>
                    <div className="flex-1 max-w-sm hidden :block justify-items-end -mb-8 pr-6">
                        <div className="flex place-content-end items-end">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
                <div>
                    <hr className="bg-rainbow-orange w-full h-1.5 border-0 my-0" />
                    <hr className="bg-rainbow-yellow w-full h-1.5 border-0 my-0" />
                    <hr className="bg-rainbow-pink w-full h-1.5 border-0 my-0" />
                    <hr className="bg-rainbow-darkpink w-full h-1.5 border-0 my-0" />
                    <hr className="bg-rainbow-blue w-full h-1.5 border-0 my-0" />
                    <hr className="bg-rainbow-purple w-full h-1.5 border-0 my-0" />
                </div>

                <div className="flex flex-row pt-12 justify-center">
                    <div className="flex-1 flex-shrink hidden lg:block">
                        <div className="flex flex-col gap-12 items-end">
                            <div className="w-full max-w-sm relative">
                                <Image className="absolute top-[-320px] min-h-[300px]" onClick={toggleWinModal} src="/flashbot-eden.svg" alt="So Extra" width="400" height="230" />
                                <Wallets useBurner={useBurner} setUseBurner={setUseBurner} />
                                <Steps
                                    isConnected={useBurner ? burnerAccount !== undefined : walletAddress !== undefined}
                                    isL0Balance={useBurner ? (burnerBalance !== undefined && burnerBalance.value > BigInt(0)) : (balance !== undefined && balance.value > BigInt(0))}
                                    isSuaveBalance={useBurner ? (burnerSuaveBalance !== undefined && burnerSuaveBalance.value > BigInt(0)) : (suaveBalance !== undefined && suaveBalance.value > BigInt(0))}
                                    isSignedTx={signedTx !== undefined}
                                    suaveTxHash={suaveTxHash}
                                    suaveTxReceipt={suaveTxReceipt}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 justify-center">
                        <div className="flex flex-col">
                            <div className="flex-1 w-full mb-6 lg:mb-0">
                                <div className="relative place-content-center">
                                    <div className="flex w-full absolute bottom-[-35px] lg:-bottom-[0px] p-5 z-10">
                                        <Image
                                            src="/so-extra-data.svg"
                                            alt="So Extra"
                                            width="597"
                                            height="239"
                                            className="object-contain mx-auto z-10"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 lg:w-full lg:min-w-[600px] flex-shrink-0 z-10">
                                <div className="flex-1 w-min-2xl flex-shrink-0 w-full px-6">
                                    {isHomePage ? <BlockBid
                                        useBurner={useBurner}
                                        setUseBurner={setUseBurner}
                                        walletAddress={walletAddress}
                                        burnerAccount={burnerAccount}
                                        signedTx={signedTx}
                                        setSignedTx={setSignedTx}
                                        suaveTxHash={suaveTxHash}
                                        setSuaveTxHash={setSuaveTxHash}
                                        suaveTxReceipt={suaveTxReceipt}
                                        setSuaveTxReceipt={setSuaveTxReceipt}
                                    /> : null}

                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex-shrink hidden lg:block z-10">
                        <div className="flex-1 w-full max-w-sm">
                            <Onboarding toggleHelpModal={toggleHelpModal} />
                            <LeaderBoard />
                            <ActiveBids />
                            <Contributors />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}