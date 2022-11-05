// pages/api/post/index.ts

import prisma from '../../../lib/prisma';
import moment from 'moment';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { budget, period } = req.body;  
  
  const first = new Date(period)
  // const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const last = moment(first).endOf('month').toDate()
  // console.log(last)

  const contentCount = await prisma.content.count({
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
    }
  })

  const result = await prisma.rewardRound.create({
    data: {
      budget: budget,
      monthYear: period,
      contentPoints: String(contentCount * 10), 
    }

  });
  res.json(result);
}
