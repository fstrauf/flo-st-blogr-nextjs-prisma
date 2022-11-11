import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;

  var voteCalls = []
  voteFields.forEach(element => {
    var voteId = ''
    if(element.Vote.length > 0){
      voteId = element.Vote[0]?.id
    }
    voteCalls.push(prisma.vote.upsert({
      where: {
        id: voteId,
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
    })
    );
  })



  const result = await prisma.$transaction(
    voteCalls
  )
  // res.json(result)

  const pointsTest = await prisma.vote.findMany({
    where: {
      rewardRoundId: String(voteFields[0].rewardRoundId)
    }
  })
  // console.log(pointsTest)

  const pointsUpdate = await prisma.vote.groupBy({
    by: ['contentId'],
    where: {
      rewardRoundId: String(voteFields[0].rewardRoundId)
    },
    _sum: {
      pointsSpent: true,
    }
  })

  // console.log(pointsUpdate)

  var contentCalls = []
  pointsUpdate.forEach(element => {
    contentCalls.push(
      prisma.content.update({
        where: {
          id: String(element.contentId)
        },
        data: {
          pointsVote: Number(element._sum.pointsSpent)
        },
      })
    )
  })

  const result2 = await prisma.$transaction(
    contentCalls
  )
  res.json(result2)

}