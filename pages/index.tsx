import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import BurnerWallet from '../components/BurnerWallet';
import LeaderBoard from '../components/LeaderBoard';
import RecentBlocks from '../components/RecentBlocks';
import Image from 'next/image';
import Onboarding from '../components/Onboarding';
import Faq from '../components/Faq';

const Home: NextPage = () => {
  return (
    <div className="bg-purple-950 text-white bg-[url('/bck.jpg')]">
      <Head>
        <title>So Extra</title>
        <meta
          content="So Extra"
          name="Buy block extra data - a new SUAVE app for Goerli"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <div className="w-full flex flex-row items-end justify-items-stretch mb-0 pt-3">
          <div className="flex flex-1 pl-12 -mb-3 justify-items-end">
            <div className="flex place-content-end">
              <Image src="/a.png" alt="So Extra" width="184" height="184" className="flex hover:animate-bounce" />
            </div>
          </div>
          <div className="flex-none">
            {/* <h1 className="text-5xl font-bold text-center">
              So Extra
            </h1> */}
            <div className="flex place-content-center">
              <div className="-mt-[15px] -mb-[175px]">
                <Image src="/logo.png" alt="So Extra" width="666" height="390" />
              </div>
            </div>
          </div>
          <div className="flex-1 justify-items-end mr-6 -mb-8">
            <div className="flex place-content-end">
              <ConnectButton />
            </div>
          </div>
        </div>

        <div>
          <hr className="bg-red-500 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-orange-400 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-yellow-300 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-lime-400 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-cyan-400 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-blue-600 w-full h-1 hover:h-10 border-0 my-0" />
          <hr className="bg-indigo-700 w-full h-1 hover:h-10 border-0 my-0" />
        </div>

        <div className="flex flex-row gap-4 justify-center items-start p-4">
          <div className="flex-1 max-w-sm justify-end">
            <div className="flex flex-col gap-12 items-center">
              <div className="flex-1 border border-white/10 rounded-2xl w-full bg-white/5 backdrop-blur-lg">
                <Onboarding />
              </div>
              <div className="flex-1 w-full">
                <BlockBid />
              </div>
              <div className="flex-1 w-full">
                <BurnerWallet />
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-2xl justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex-1 w-full">
                <RecentBlocks />
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-sm justify-start">
            <div className="flex flex-col gap-12">
              <div className="flex-1 w-full">
                <LeaderBoard />
              </div>
              <div className="flex-1 border border-white/10 rounded-2xl w-full bg-white/5 backdrop-blur-lg">
                <Faq />
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
