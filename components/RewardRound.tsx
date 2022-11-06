import React from "react";
import Router from "next/router";
import { useSession, getSession } from 'next-auth/react';

export type RewardRoundProps = {
  url: string;
  id: string;
  title: string;
  budget: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const RewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { data: session } = useSession();

  return (
    <div className="">
      <div className="border-solid border-black grid grid-cols-2" >
        <h2 className="font-bold">Period</h2>
        <p>{rewardRound.monthYear}</p>
        <h2 className="font-bold">Budget</h2>
        <p>{rewardRound.budget}</p>
        <p className="col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p>
        <div className="grid grid-cols-2 mt-4">
          <p className="font-bold">Content piece</p>
          <p className="font-bold">Points Voted</p>
          {rewardRound.Content?.map((content) => (

              <>
              <p>{content.description}</p>
              <p>{content.pointsVote}</p>
              </>

          ))}
        </div>
      </div>
      <button className="border-solid border-2 border-sky-500 rounded"
        onClick={() => {
          Router.push({
            pathname: "/r/[id]",
            query: {
              id: rewardRound.id,
              session: session.user.email,
            },
          })
        }}>Vote</button>
    </div>
  );
};

export default RewardRound;
