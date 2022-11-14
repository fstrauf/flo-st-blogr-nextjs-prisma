// pages/content.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { PostProps } from '../components/Post';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { content: [] } };
  }

  const content = await prisma.content.findMany({

  });

  return {
    props: { content },
  };
};

type Props = {
  content: PostProps[];
};

const Content: React.FC<Props> = (props) => {
  const { data: session } = useSession();


  if (!session) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold underline">Content</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>Content</h1>
        <main>
          {props.content.map((content) => (
            <div key={content.id} className="post">
              <p>{content.description}</p>
              <p>{content.url}</p>
              <p>{content.pointsVote}</p>
              <p>{content?.createdOn?.toDateString()}</p>
            </div>
          ))}
        </main>
      </div>      
    </Layout>
  );
};

export default Content;
