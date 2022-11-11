import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { rewardRound } = req.body;

  const openRound = await prisma.rewardRound.update({
    where: {
      id: rewardRound.id,
    },
    data: {
      isOpen: true,
    }
  })

  res.json(openRound)
}