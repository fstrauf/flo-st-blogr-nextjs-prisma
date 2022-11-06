// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { Listbox } from '@headlessui/react'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { users: [] } };
  }

  const users = await prisma.user.findMany({

  });
  return {
    props: { users },
  };
};

const newContent: React.FC = (props) => {
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(props.users[0]);
  const [url, setUrl] = useState('');
  const [date, setDate] = useState(new Date());


  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, selectedUser, url, date };
      await fetch('/api/post', {
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
            onChange={(e) => setDate(e.target.value)}
            placeholder="dd-mm-yyyy"
            type="date"
            value={date}
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
          {/* <DatePicker 
            selected={date} 
            onChange={(date) => setDate(date)} /> */}
          <Listbox value={selectedUser} onChange={setSelectedUser}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full m-2 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">{selectedUser.name}</Listbox.Button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {props.users.map((user) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
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
          <input className='bg-gray-200 border-solid border-2 border-sky-500 rounded m-4' disabled={!selectedUser || !title || !date} type="submit" value="Create" />
          <a className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>

    </Layout>
  );
};

export default newContent;
