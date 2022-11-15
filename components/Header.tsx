// @ts-ignore
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
// import axios from 'axios';
// import { EvmChain } from '@moralisweb3/evm-utils';

export default function Header() {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({ connector: new InjectedConnector() });
    const userData = { address: account, chain: chain.id, network: 'evm' };

    try {
      // const body = { title, selectedUser, url, selectedRewardRound };
      const response = await fetch('/api/auth/request-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      // console.log('Data')
      // console.log(data)

      // const message = data
      const message = data.message;
      const signature = await signMessageAsync({ message });
      // const { url } = await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/' });
      await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/' });

      // push(url);

      // await Router.push('/');
      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  let left = (
    <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
      <Link href="/" data-active={isActive('/')}>
        Feed
      </Link>

    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
        <Link href="/" className="bold" data-active={isActive('/')}>
          Feed
        </Link>

      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>

      </div>
    );
  }

  if (!session) {
    right = (
      <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
        <button onClick={submitData}>Authenticate via Metamask</button>
      </div>
    );
  }

  if (session) {
    left = (
      <div className='flex '>
        <Link href="/" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/')}>
          Home
        </Link>
        {/* <Link href="/drafts" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/drafts')}>
          My drafts
        </Link>
        <Link href="/content" className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" data-active={isActive('/content')}>
          Content
        </Link> */}

      </div>
    );
    right = (
      <div className="flex">
        <p className='m-2'>
          {session?.user?.name} ({session?.user?.email})
        </p>
        <Link className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" href="/newContent">
          <button>
            New content
          </button>
        </Link>
        <Link className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" href="/newRewardRound">
          <button>
            New Reward Round
          </button>
        </Link>
        <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" onClick={() => signOut({callbackUrl: '/'})}>
          <a>Log out</a>
        </button>

      </div>
    );
  }

  return (
    <nav className="mt-16 mb-16 flex flex-col items-center md:mb-12 md:flex-row md:justify-between">
      {left}
      {right}

    </nav>
  );
};