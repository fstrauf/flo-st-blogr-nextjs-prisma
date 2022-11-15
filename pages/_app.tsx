import '../styles/globals.css'
// import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

const supportedChainIds = [4];
const connectors = {
  injected: {}
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThirdwebProvider>
  );
};

export default App;
