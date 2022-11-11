import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { rewardRound } = req.body;
  const pointsVoted = rewardRound.Content.reduce((a, v) => a = a + Number(v.pointsVote), 0)

  var payout = []
  rewardRound.Content.forEach(content => {
    content.ContentAuthor.forEach(contentAuthor => {
      payout.push({
        ...contentAuthor,
        authorCash: content.pointsVote / pointsVoted * rewardRound.budget / content.ContentAuthor.length
      })
    })
  })

  var authorPayout = [];
  payout.reduce(function (res, value) {
    if (!res[value.userId]) {
      res[value.userId] = { userId: value.userId, authorCash: 0 };
      authorPayout.push(res[value.userId])
    }
    res[value.userId].authorCash += value.authorCash;
    return res;
  }, {});

  console.log(authorPayout)

  var payCalls = []

  authorPayout.forEach(authorPayout => {
    payCalls.push(prisma.payout.create({
      data: {
        cashReward: authorPayout.authorCash,
        rewardRound: {
          connect: {
            id: rewardRound.id,
          }
        },
        user: {
          connect: {
            id: authorPayout.userId,
          }
        }
      },
    }))
    // res.json(result);
  })

  payCalls.push(
    prisma.rewardRound.update({
      where:{
        id: rewardRound.id,
      },
      data: {
        isOpen: false,
      }      
      
    })
  )

  const result = await prisma.$transaction(
    payCalls
  )
  res.json(result)


}