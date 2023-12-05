import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import BlockBid from '../components/BlockBid';
import BurnerWallet from '../components/BurnerWallet';
import RecentBlocks from '../components/RecentBlocks';
import SlotNumber from '../components/SlotNumber';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>So Extra</title>
        <meta
          content="So Extra"
          name="Buy block extra data - a new SUAVE app for Goerli"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className="border w-full flex flex-row gap-2 justify-between mb-6">
          <div className="flex border">
            <h1 className="text-5xl">
              So Extra
            </h1>
          </div>
          <div className="flex border">
            <h1 className="text-5xl">
              So Extra
            </h1>
          </div>
          <div className="flex border">
            <ConnectButton />
          </div>
        </div>

        <div className="border flex flex-row gap-2">
          <div className="flex-1 border">
            <div className="flex flex-col gap-6">
              <div className="flex-1 border">
                <h2 className="text-2xl mb-2">
                  Burner Wallet
                </h2>
                <BurnerWallet />
              </div>
              <div className="flex-1 border">
                <h2 className="text-2xl mb-2">
                  Bid on a Block
                </h2>
                <BlockBid />
              </div>
              {/* <SlotNumber /> */}
            </div>
          </div>
          <div className="flex-1 border">
            <div className="flex flex-col">
              <RecentBlocks />
            </div>
          </div>
          <div className="flex-1 border">
            <div className="flex flex-col">
              <h2 className="text-2xl">
                Leader Board
              </h2>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
