import '../styles/globals.css'

import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    </WagmiConfig>
  );
};

export default App;
