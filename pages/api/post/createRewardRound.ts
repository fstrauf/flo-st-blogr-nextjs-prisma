import prisma from '../../../lib/prisma';
// import moment from 'moment';

//Todo: create reward round early on without content.
// update the content points with every piece of content that is added to the round.

export default async function handle(req, res) {
  const { budget, period } = req.body;  
  // const first = new Date(period)
  // const last = moment(first).endOf('month').toDate()

  // const contentCount = await prisma.content.count({
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
  //   }
  // })

  const result = await prisma.rewardRound.create({
    data: {
      budget: Number(budget),
      monthYear: period,
      // contentPoints: Number(contentCount * 10), 
    }

  });
  res.json(result);
}
