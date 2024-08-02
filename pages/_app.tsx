import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider } from 'wagmi';
import { mainnet, holesky } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { rigil, toliman } from '../hooks/useSuave'

const config = getDefaultConfig({
  appName: 'So Extra',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [holesky, mainnet, toliman, rigil],
  transports: {
    [mainnet.id]: http(),
    [holesky.id]: http(),
    [toliman.id]: http(),
    [rigil.id]: http()
  },
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
