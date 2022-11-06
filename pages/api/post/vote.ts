import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;
  const util = require('util');

  // console.log(voteFields)

  voteFields.forEach(async element => {
    const result = await prisma.vote.upsert({
      where: {
        id: util.isUndefined(element.voteId) ? '' : element.voteId
      },
      create: {
        pointsSpent: Number(element.pointsSpent),
        user: {
          connect: {
            id: element.userId
          }
        },
        rewardRound: {
          connect: {
            id: element.rewardRoundId
          }
        },
        content: {
          connect: {
            id: element.id
          }
        }
      },
      update: {
        pointsSpent: Number(element.pointsSpent),
      }
      //reward round points spent based on sum of all votes and historic value
    });
    res.json(result);
  })

  const pointsUpdate = await prisma.vote.groupBy({
    by: ['contentId'],
    where: {
      rewardRoundId: voteFields[0].rewardRoundID
    },
    _sum: {
      pointsSpent: true,
    }
  })

  console.log(pointsUpdate)

  pointsUpdate.forEach(async element => {
    await prisma.content.update({
      where: {
        id: element.contentId
      },
      data: {
        pointsVote: Number(element._sum.pointsSpent)
      },
    })
  })
}

  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: String(voteFields[0]?.userId),
  //   },
  // },
  // );

//   voteFields.forEach(async element => {
//     const result = await prisma.vote.upsert({
//       data: {
//         pointsSpent: element.pointsSpent,
//         user: {
//           connect: {
//             id: element.userId
//           }
//         },
//         rewardRound: {
//           connect: {
//             id: element.rewardRoundID
//           }
//         },
//         content: {
//           connect: {
//             id: element.id
//           }
//         }
//       }
//     });
//     res.json(result);
//   });
// }

// voteFields.forEach(async element => {
//   const result = await prisma.vote.create({
//     data: {
//       pointsSpent: element.pointsSpent,
//       user: {
//         connect: {
//           id: element.userId
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
//   res.json(result);
// });

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