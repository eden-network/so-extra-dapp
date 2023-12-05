import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import BurnerWallet from '../components/BurnerWallet';
import LeaderBoard from '../components/LeaderBoard';
import RecentBlocks from '../components/RecentBlocks';

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

      <main className="p-6">
        <div className="w-full flex flex-row gap-2 justify-between items-center mb-6">
          <div className="flex-none justify-self-start">
            <h1 className="text-xs">
              todo: logo
            </h1>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-5xl">
              So Extra
            </h1>
          </div>
          <div className="flex-none justify-self-end">
            <ConnectButton />
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex-1 p-4 max-w-sm">
            <div className="flex flex-col gap-6 items-center">
              <div className="flex-1 border rounded-xl p-4 max-w-sm">
                <h2 className="text-2xl mb-2 text-center">
                  Burner Wallet
                </h2>
                <BurnerWallet />
              </div>
              <div className="flex-1 border rounded-xl p-4 max-w-sm">
                <h2 className="text-2xl mb-2 text-center">
                  Bid on a Block
                </h2>
                <BlockBid />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 max-w-xl">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-xl p-4 max-w-xl">
                <h2 className="text-2xl mb-2 text-center">
                  Recent Blocks
                </h2>
                <RecentBlocks />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 max-w-sm">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border rounded-xl p-4 max-w-sm">
                <h2 className="text-2xl mb-2 text-center">
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
