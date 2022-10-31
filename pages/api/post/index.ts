// pages/api/post/index.ts

// import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, selectedUser, url, date } = req.body;

  const result = await prisma.contentAuthor.create({
    data: {
      content: {
        create: {
          description: title,
          url: url,
          createdOn: new Date(date),
        }
      },
      user: {
        connect: {
          id: selectedUser.id
        }
      }
    },
  
  });
  res.json(result);
}
