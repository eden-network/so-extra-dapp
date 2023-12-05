import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import BurnerWallet from '../components/BurnerWallet';
import LeaderBoard from '../components/LeaderBoard';
import RecentBlocks from '../components/RecentBlocks';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>So Extra</title>
        <meta
          content="So Extra"
          name="Buy block extra data - a new SUAVE app for Goerli"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <div className="w-full flex flex-row gap-2 justify-between items-center mb-6 pt-6 px-6">
          <div className="flex-none justify-self-start">
            <Image src="/a.png" alt="So Extra" width="92" height="92" />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-5xl font-bold">
              So Extra
            </h1>
          </div>
          <div className="flex-none justify-self-end">
            <ConnectButton />
          </div>
        </div>

        <div className="">
          <hr className="bg-red-500 w-full h-2 border-0 my-0" />
          <hr className="bg-orange-500 w-full h-2 border-0 my-0" />
          <hr className="bg-yellow-500 w-full h-2 border-0 my-0" />
          <hr className="bg-green-500 w-full h-2 border-0 my-0" />
          <hr className="bg-blue-500 w-full h-2 border-0 my-0" />
          <hr className="bg-indigo-500 w-full h-2 border-0 my-0" />
          <hr className="bg-violet-500 w-full h-2 border-0 my-0" />
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex-1 p-4 max-w-sm">
            <div className="flex flex-col gap-6 items-center">
              <div className="flex-1 border rounded-xl p-4 pt-2 max-w-sm">
                <h2 className="text-2xl mb-4 text-center font-semibold">
                  Burner Wallet
                </h2>
                <BurnerWallet />
              </div>
              <div className="flex-1 border rounded-xl p-4 pt-2 max-w-sm">
                <h2 className="text-2xl mb-4 text-center font-semibold">
                  Bid on a Block
                </h2>
                <BlockBid />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 max-w-xl">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-xl p-4 pt-2 max-w-xl">
                <h2 className="text-2xl mb-4 text-center font-semibold">
                  Recent Blocks
                </h2>
                <RecentBlocks />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 max-w-sm">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-xl p-4 pt-2 max-w-sm">
                <h2 className="text-2xl mb-4 text-center font-semibold">
                  Leader Board
                </h2>
                <LeaderBoard />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center border-t">
        <a href="https://twitter.com/MihaLotric" rel="noopener noreferrer" target="_blank">
          @MihaLotric
        </a>
      </footer>
    </div>
  );
};

export default Home;
