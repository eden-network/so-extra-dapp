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
        <div className="w-full flex flex-row items-center mb-0 pt-3">
          <div className="flex-1 ml-6 -mb-3 justify-start">
            <Image src="/a.png" alt="So Extra" width="92" height="92" />
          </div>
          <div className="flex-1 text-center justify-center">
            <h1 className="text-5xl font-bold">
              So Extra
            </h1>
          </div>
          <div className="flex-1 justify-end mr-3">
            <div>
              <ConnectButton />
            </div>
          </div>
        </div>

        <div>
          <hr className="bg-red-500 w-full h-1 border-0 my-0" />
          <hr className="bg-orange-500 w-full h-1 border-0 my-0" />
          <hr className="bg-yellow-500 w-full h-1 border-0 my-0" />
          <hr className="bg-green-500 w-full h-1 border-0 my-0" />
          <hr className="bg-blue-500 w-full h-1 border-0 my-0" />
          <hr className="bg-indigo-500 w-full h-1 border-0 my-0" />
          <hr className="bg-violet-500 w-full h-1 border-0 my-0" />
        </div>

        <div className="flex flex-row gap-4 justify-center items-start p-4">
          <div className="flex-1 max-w-sm justify-end">
            <div className="flex flex-col gap-6 items-center">
              <div className="flex-1 border rounded-2xl w-full">
                <BurnerWallet />
              </div>
              <div className="flex-1 border rounded-2xl w-full">
                <BlockBid />
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-2xl justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-2xl w-full">
                <RecentBlocks />
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-sm justify-start">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-2xl w-full">
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
