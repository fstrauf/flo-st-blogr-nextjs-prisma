import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: String(voteFields[0]?.userId),
    },
  },
  );

  voteFields.forEach(async element => {
    const result = await prisma.vote.create({
      data: {
        pointsSpent: element.pointsSpent,
        user: {
          connect: {
            id: user.id
          }
        },
        rewardRound: {
          connect: {
            id: element.rewardRoundID
          }
        },
        content: {
          connect: {
            id: element.id
          }
        }
      }
    });
    res.json(result);
  });
}

  // const bulkCreates = voteFields.map(element => {
  //   prisma.vote.create({
  //     data: {
  //       pointsSpent: element.pointsSpent,
  //       user: {
  //         connect: {
  //           id: user.id
  //         }
  //       },
  //       rewardRound: {
  //         connect: {
  //           id: element.rewardRoundID
  //         }
  //       },
  //       content: {
  //         connect: {
  //           id: element.id
  //         }
  //       }
  //     }

  //   });
  // })

  // await prisma.$transaction(
  //   bulkCreates
  // )