// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
// import Router from 'next/router';
import Router, { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import prisma from '../lib/prisma';
import { Listbox } from '@headlessui/react'
import { useSession, signIn } from 'next-auth/react';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { users: [] } };
  }

  const rewardRound = await prisma.rewardRound.findMany({
    where: {
      isOpen: false,
    },
    orderBy: [
      {
        monthYear: 'desc',
      },
    ]
  });

  const users = await prisma.user.findMany({

  });
  return {
    props: { users, rewardRound },
  };
};

type Props = {
  users: any;
  rewardRound: any;

}

const NewContent: React.FC<Props> = (props) => {

  // console.log(props)
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(props.users[0]);
  const [user, setUser] = useState("");
  const [selectedRewardRound, setSelectedRewardRound] = useState(!(props?.rewardRound[0]));
  const [url, setUrl] = useState('');

  if (!session) {
    return (
      <Layout>
        <div>Please log in</div>
      </Layout>
    )
  }


  
  // const [date, setDate] = useState(new Date());
  // const { connectAsync } = useConnect();
  // const { disconnectAsync } = useDisconnect();
  // const { isConnected } = useAccount();
  // const { signMessageAsync } = useSignMessage();
  // const { push } = useRouter();
  // const { push } = useRouter();

  const setUserName = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    console.log(user)
    try {
      const body = { user, session };
      await fetch('/api/post/setUserName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      // await Router.push('/');
      console.log('successful');
      const { url } = await signOut({callbackUrl: '/'})
      await Router.push(url);

    } catch (error) {
      console.error(error);
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, selectedUser, url, selectedRewardRound };
      await fetch('/api/post/createContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {!session?.user?.name && (
        <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
          <h1>First Time? Set Username!</h1>
          <form onSubmit={setUserName}>
            <input
              autoFocus
              onChange={(e) => setUser(e.target.value)}
              placeholder="Name"
              type="text"
              value={user}
              className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            />
          </form>
          <button className='bg-gray-200 border-solid border-2 border-sky-500 rounded m-4' onClick={setUserName}>Save</button>
        </div>
      )}
      <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
        <form onSubmit={submitData}>
          <h1 className="text-3xl font-bold">Create New Content</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Description"
            type="text"
            value={title}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            placeholder="url"
            type="text"
            value={url}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          {/* <input
            autoFocus
            onChange={(e) => setDate(e.target.value)}
            placeholder="dd-mm-yyyy"
            type="date"
            value={date}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          /> */}
          <Listbox value={selectedRewardRound} onChange={setSelectedRewardRound}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full m-2 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">{selectedRewardRound.monthYear}</Listbox.Button>
              <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {props.rewardRound.map((rewardRound) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'z-50 bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    key={rewardRound.id}
                    value={rewardRound}
                  >
                    {rewardRound.monthYear}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <Listbox value={selectedUser} onChange={setSelectedUser}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full m-2 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">{selectedUser.name}</Listbox.Button>
              <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {props.users.map((user) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'z-50 bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    key={user.id}
                    value={user}
                  >
                    {user.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <input className='bg-gray-200 border-solid border-2 border-sky-500 rounded m-4' disabled={!selectedUser || !title || !selectedRewardRound} type="submit" value="Create" />
          <a className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>

    </Layout>
  );
};

export default newContent;
