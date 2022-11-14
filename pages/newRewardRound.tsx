// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';


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

const NewRewardRound: React.FC = (props) => {
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState(new Date());  
  // const [contentPoints, setContentPoints] = useState('');  x
  // const [date, setDate] = useState(new Date());

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { budget, period };
      await fetch('/api/post/createRewardRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      console.log('reward round created');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>Reward Round</h1>
          <input
            autoFocus
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            type="text"
            value={budget}
          />
          <input
            autoFocus
            onChange={(e) => setPeriod(new Date(e.target.value))}
            placeholder="Selection Period"
            type="month"
            // value={period}
          />
          {/* <input
            autoFocus
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="author"
            type="text"
            value={author}
          /> */}
          {/* <Listbox value={selectedUser} onChange={setSelectedUser}>
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
          </Listbox> */}
          <input disabled={!budget || !period} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>     
    </Layout>
  );
};

export default newRewardRound;
