import React from "react";
import Router from "next/router";
import { useSession, getSession } from 'next-auth/react';

export type RewardRoundProps = {
  url: string;
  id: string;
  title: string;
  budget: Number;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  isOpen: boolean;
  contentPoints: Number;
  monthYear: any;
  Content: any;
  Payout: any;
};



const RewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { data: session } = useSession();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/closeRewardRound', {
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

  const openRewardRound = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/openRewardRound', {
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
    <div className="">
      <div className="border-solid border-black grid grid-cols-2" >
        <h2 className="font-bold">Period</h2>
        <p>{rewardRound.monthYear}</p>
        <h2 className="font-bold">Budget</h2>
        <p>{rewardRound.budget}</p>
        <h2 className="font-bold">ContentPoints per Voter</h2>
        <p>{rewardRound.contentPoints}</p>
        <p className="col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p>
        <div className="grid grid-cols-3 mt-4">
          <p className="font-bold">Content piece</p>
          <p className="font-bold">Points Voted</p>
          <p className="font-bold">Authors</p>
          {rewardRound.Content?.map((content: any) => (
            <>
              <p>{content.description}</p>
              <p>{content.pointsVote}</p>
              <div>
                {content.ContentAuthor.map((author: any) => (
                  <div key={author.id}>
                    <p>{author.user.name}</p>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
        <div className="grid grid-cols-2">
          {rewardRound.Payout?.map((payout: any) => (
            <div key={payout.id}>
              <p>{payout.user.name}</p>
              <p>{payout.cashReward}</p>
            </div>
          ))}
        </div>
      </div>
      {session?.user && rewardRound.isOpen && (
        <>
          <button className="border-solid border-2 border-sky-500 rounded m-3"
            onClick={() => {
              Router.push({
                pathname: "/r/[id]",
                query: {
                  id: rewardRound.id,
                  session: session?.user?.email,
                },
              })
            }}>Vote</button>
          <button className="border-solid border-2 border-sky-500 rounded m-3"
            onClick={submitData}>
            Close Reward Round for all
          </button>
        </>
      )}
      {session?.user && !rewardRound.isOpen && (
        <button className="border-solid border-2 border-sky-500 rounded m-3"
          onClick={openRewardRound}>
          Open Reward Round
        </button>
      )}
    </div>
  );
};

export default RewardRound;
