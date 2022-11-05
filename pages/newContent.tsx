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
      const body = { title, selectedUser, url , date};
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
      <div>
        <form onSubmit={submitData}>
          <h1>Content</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Description"
            type="text"
            value={title}
          />
          <input
            autoFocus
            onChange={(e) => setDate(e.target.value)}
            placeholder="dd-mm-yyyy"
            type="date"
            value={date}
          />
          <input
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            placeholder="url"
            type="text"
            value={url}
          />
            {/* <DatePicker 
            selected={date} 
            onChange={(date) => setDate(date)} /> */}
          <Listbox value={selectedUser} onChange={setSelectedUser}>
            <Listbox.Button>{selectedUser.name}</Listbox.Button>
            <Listbox.Options>
              {props.users.map((user) => (
                <Listbox.Option
                  key={user.id}
                  value={user}
                >
                  {user.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <input disabled={!selectedUser || !title || !date} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
   
    </Layout>
  );
};

export default newContent;
