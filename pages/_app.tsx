import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { holesky } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { rigil, toliman } from '../hooks/useSuave'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'



const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    holesky, rigil, toliman
  ],
  [
    jsonRpcProvider({
      rpc: () => ({

        http: `https://holesky.drpc.org`,
      }),
    }),
    // publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'So Extra',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [
    holesky,
    // rigil // hide from ui
  ],
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
