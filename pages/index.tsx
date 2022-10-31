import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

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

  });

  return {
    props: {
      feed,
      payout,
      rewardRound,
    },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[]
  payout: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">

        <main>
          <h1>Reward Round Payout</h1>
          <p>{props.payout[0].rewardRound.monthYear}</p>
          {props.payout.map((payout) => (
            <div>
              <p>{payout.user.name}</p>
              <p>{payout.cashReward}</p>
            </div>
          ))}
          <h1>Reward Rounds</h1>
          {props.rewardRound.map((rewardRound) => (
            <div>
              <p>{rewardRound.monthYear}</p>
              <p>{rewardRound.budget}</p>
            </div>
          ))}
          <h1>Public Feed</h1>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
