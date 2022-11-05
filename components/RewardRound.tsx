import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

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
  // const authorName = rewardRound.author ? rewardRound.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/r/[id]", `/r/${rewardRound.id}`)}>
      <h2>{rewardRound.title}</h2>
      {/* <small>By {authorName}</small> */}
      {/* <ReactMarkdown children={post.content} /> */}

    </div>
  );
};

export default RewardRound;
