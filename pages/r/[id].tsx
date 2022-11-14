import React, { use, useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const user = await prisma.user.findUnique({
    where: {
      email: String(query.session),
    },
  },
  );

  const rewardRound = await prisma.rewardRound.findUnique({
    where: {
      id: String(query?.id),
    },
    include: {
      Content: {
        include: {
          Vote: {
            where: {
              userId: {
                equals: user.id
              }
            },
          }
        }

      }
    },
  });

  // const rewardRound = await prisma.rewardRound.findUnique({
  //   where: {
  //     id: String(query?.id),
  //   },
  //   include: {
  //     Vote: {
  //       where: {
  //         userId: {
  //           equals: user.id
  //         }
  //       },
  //       include: {
  //         content: {}
  //       }
  //     },
  //     Content: {

  //     }
  //   },
  // });

  return {
    props: {
      rewardRound,
      user,
    },
  };
};

type Props = {
  user: any;
  rewardRound: any;

}

const RewardRound: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const util = require('util');

  // if (status === 'loading') {
  //   return <div>Authenticating ...</div>;
  // }

  // const userHasValidSession = Boolean(session);
  // const postBelongsToUser = session?.user?.email === props.author?.email;
  // let title = props.title;
  // if (!props.published) {
  //   title = `${title} (Draft)`;
  // }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { voteFields };
      await fetch('/api/post/vote', {
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

  // console.log(props.rewardRound)

  // const votePrep = props.rewardRound?.Vote?.map(vote => {
  //   return {
  //     ...vote,
  //     description: vote.content.description,
  //   };
  // }
  // );

  // console.log(votePrep2)


  const votePrep = props.rewardRound?.Content?.map(content => {
    return {
      ...content,
      // rewardRoundID: props.rewardRound.id,
      userId: props.user.id,
      pointsSpent: util.isUndefined(content.Vote[0]?.pointsSpent) ? 0 : Number(content.Vote[0]?.pointsSpent),
      // voteId: props.rewardRound.Vote[index]?.id
    };
  });

  console.log(votePrep)

  const [voteFields, setvoteFields] = useState(votePrep)
  const [totalVoted, setTotalVoted] = useState(votePrep.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
  const [totalReached, setTotalReached] = useState(false)

  const handleFormChange = (index, event) => {
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)

    let totalVote = (data.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
    setTotalVoted(totalVote)
    if (totalVote > Number(props.rewardRound.contentPoints)) {
      setTotalReached(true)
    } else {
      setTotalReached(false)
    }
  }

  console.log(voteFields)

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex flex-col mb-10 m-auto'>
        <div className='grid grid-cols-2'>
          <h2 className="font-bold">Period</h2>
          <p>{props.rewardRound.monthYear}</p>
          <h2 className="font-bold">Budget</h2>
          <p>{props.rewardRound.budget}</p>
          <h2 className="font-bold">Your Vote vs. your vote budget</h2>
          <p className={`${totalReached ? 'text-red-600' : 'text-black'}`}>{totalVoted}/{props.rewardRound.contentPoints}</p>
        </div>

        <h1 className="font-bold mt-4 mb-4">points spent to be set</h1>
        <div>
          <form className='grid grid-cols-4' onSubmit={submitData}>
            {voteFields.map((input, index) => (
              <>
                <p>{input.description}</p>
                <p>{input?.createdOn?.toDateString()}</p>
                <p>{input.url}</p>
                <input
                  name='pointsSpent'
                  placeholder='Vote'
                  type="number"
                  value={input.pointsSpent}
                  onChange={event => handleFormChange(index, event)}
                  className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                />
              </>
            ))}
            <button className='bg-gray-200 border-solid border-2 border-sky-500 rounded m-4' onClick={submitData}>Submit</button>
          </form>
        </div>


        {/* <p>By {props?.author?.name || 'Unknown author'}</p> */}
        {/* <ReactMarkdown children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {
          userHasValidSession && postBelongsToUser && (
            <button onClick={() => deletePost(props.id)}>Delete</button>
          )
        } */}
      </div>
    </Layout>
  );
};

export default RewardRound;
