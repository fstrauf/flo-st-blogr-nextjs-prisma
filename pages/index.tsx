import React, { useState } from 'react';
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import RewardRound from "../components/RewardRound";
import { useSession, signIn } from 'next-auth/react';
import { getSession, signOut } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async () => {

  const rewardRound = await prisma.rewardRound.findMany({
    take: 3,
    include: {
      Content: {
        include: {
          ContentAuthor: {
            include: {
              user: {}
            }

          }
        }
      },
      Payout: {
        include: {
          user: {},
        }
      }
    },
    orderBy: [
      {
        monthYear: 'desc',
      },
    ]
  });

  return {
    props: {
      // feed,
      // payout,
      rewardRound,
    },
    // revalidate: 10,
  };
};

type Props = {
  payout: PostProps[];
  rewardRound: any;
}

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState("");

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
      await signOut({ callbackUrl: '/' })
      // await Router.push(url);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      {session && !session?.user?.name && (
        <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
          <h1>First Time? Set Username, save & then log back in</h1>
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
      <div className="max-w-5xl mt-2 flex flex-col mb-10 m-auto">
        <main>
          <h1 className="text-3xl font-bold">Reward Rounds (choose one to vote)</h1>
          <div className="flex flex-col">
            {props.rewardRound.map((rewardRound) => (
              <div className="bg-gray-400 m-4" key={rewardRound.id}>
                <RewardRound rewardRound={rewardRound} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
