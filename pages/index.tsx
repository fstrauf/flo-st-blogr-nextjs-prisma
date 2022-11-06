import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import RewardRound from "../components/RewardRound";

export const getServerSideProps: GetServerSideProps = async () => {
  // const feed = await prisma.post.findMany({
  //   where: { published: true },
  //   include: {
  //     author: {
  //       select: { name: true },
  //     },
  //   },
  // });

  const payout = await prisma.payout.findMany({
    include: {
      user: {
        select: { name: true },
      },
      rewardRound: {
        select: { monthYear: true },
      },
    },
  });

  const rewardRound = await prisma.rewardRound.findMany({
    take: 3,
    include: {
      Content: {
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
      payout,
      rewardRound,
    },
    // revalidate: 10,
  };
};

type Props = {
  // feed: PostProps[]
  payout: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="max-w-5xl mt-2 flex flex-col mb-10 m-auto">
        <main>
          {/* <h1 className="text-3xl font-bold">Reward Round Payout</h1>
          {props.payout.map((payout) => (
            <div>
              <p>{payout.user.name}</p>
              <p>{payout.cashReward}</p>
            </div>
          ))} */}
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
