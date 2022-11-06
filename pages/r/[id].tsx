// pages/r/[id].tsx

import React, { use, useState } from 'react';
import { GetServerSideProps } from 'next';
// import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
// import { RewardRoundProps } from '../../components/RewardRound';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import moment from 'moment';
// import { isUndefined } from 'util';

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
      Vote: {
        // select: { 
        //   pointsSpent: true,
        //   id: true,
        // },
        where: {
          userId: {
            equals: user.id
          }
        },
      },
      Content: {

      }
    },
  });

  // const first = new Date(rewardRound.monthYear)
  // const last = moment(first).endOf('month').toDate()

  // const content = await prisma.content.findMany({
  //   where: {
  //     AND: [
  //       {
  //         createdOn: {
  //           lte: last
  //         },
  //       },
  //       {
  //         createdOn: {
  //           gte: first
  //         },
  //       },
  //     ],
  //   },
  //   include: {
  //     Vote: {
  //       where: {
  //         AND: [
  //           {
  //             userId: {
  //               equals: user.id
  //             }
  //           },
  //           {
  //             rewardRoundId: {
  //               equals: String(query?.id)
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   }
  // });

  return {
    props: {
      // content,
      rewardRound,
      user,
    },
  };
};



// async function publishPost(id: string): Promise<void> {
//   await fetch(`/api/publish/${id}`, {
//     method: 'PUT',
//   });
//   await Router.push('/');
// }

// async function deletePost(id: string): Promise<void> {
//   await fetch(`/api/post/${id}`, {
//     method: 'DELETE',
//   });
//   Router.push('/');
// }


const RewardRound: React.FC = (props) => {
  // const RewardRound: React.FC<RewardRoundProps> = (props) => {
  const { data: session, status } = useSession();
  const util = require('util');



  // console.log(session)
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: String(session?.user?.email),
  //   },
  // },
  // );

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
  // console.log(props.content)


  // voteFields.map((input, index) => (
  const votePrep = props.rewardRound?.Content?.map((content,index) => {
    return {
      ...content,
      // rewardRoundID: props.rewardRound.id,
      userId: props.user.id,
      pointsSpent: util.isUndefined(props.rewardRound.Vote[index]) ? 0 : Number(props.rewardRound.Vote[index]?.pointsSpent),
      voteId: props.rewardRound.Vote[index]?.id
    };
  }
  );

  // console.log(votePrep)

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
