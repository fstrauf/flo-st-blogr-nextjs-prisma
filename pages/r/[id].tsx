// pages/r/[id].tsx

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
// import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
// import { RewardRoundProps } from '../../components/RewardRound';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import moment from 'moment';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const rewardRound = await prisma.rewardRound.findUnique({
    where: {
      id: String(params?.id),
    },
  },
  );

  const first = new Date(rewardRound.monthYear)
  // const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const last = moment(first).endOf('month').toDate()

  const content = await prisma.content.findMany({
    where: {
      AND: [
        {
          createdOn: {
            lte: last
          },
        },
        {
          createdOn: {
            gte: first
          },
        },
      ],
    },
    include: {
      Vote: {

      }
    }
  });

  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: String(session?.user?.email),
  //   },
  // },
  // );

  // console.log(content)

  return {
    props: {
      content,
      rewardRound,
      // user,
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

  // console.log(props.content)

  const votePrep = props.content.map(content => {
    return {
      ...content,
      rewardRoundID: props.rewardRound.id,
      userId: session.user.email,
      pointsSpent: ''
    };
  }
  );

  const [voteFields, setvoteFields] = useState(votePrep)

  const handleFormChange = (index, event) => {
    // console.log(index)
    // console.log(event)
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)
    // console.log(voteFields)
  }

  return (
    <Layout>
      <div>
        {/* <h2>{ptitle}</h2> */}
        <p>{props.rewardRound.budget}</p>
        <p>{props.rewardRound.contentPoints}</p>


        {/* collect rewardRound ID - done
    collect UserID - via session
    collect contenID -from each line item */}
        points spent to be set
        <div>
          <form onSubmit={submitData}>
            {voteFields.map((input, index) => (
              <div className="post" key={index}>
                <p>{input.description}</p>
                <p>{input?.createdOn?.toDateString()}</p>
                <p>{input.url}</p>
                <input
                  name='pointsSpent'
                  placeholder='Vote'
                  // value={input.pointsSpent}
                  onChange={event => handleFormChange(index, event)}
                />
              </div>
            ))}
            {/* <input disabled={!selectedUser || !title || !date} type="submit" value="Create" />
            <a className="back" href="#" onClick={() => Router.push('/')}>
              or Cancel
            </a> */}
            <button onClick={submitData}>Submit</button>
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
