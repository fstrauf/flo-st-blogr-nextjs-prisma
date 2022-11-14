
import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { user, session } = req.body;

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.user.create({
    data: {
      name: user,
      wallet: session.user.address,
    },
  })


  
  
  // const response = await prisma.$transaction([
  //   prisma.contentAuthor.create({
  //     data: {
  //       content: {
  //         create: {
  //           description: title,
  //           url: url,
  //           rewardRound: {                      
  //             connect: {
  //               id: selectedRewardRound.id
  //             },                          
  //           },
  //         },                
  //       },
  //       user: {
  //         connect: {
  //           id: selectedUser.id
  //         }
  //       }      
  //     },  
  //   }),
  //   prisma.rewardRound.update({
  //     where: {
  //       id: selectedRewardRound.id,
  //     },
  //     data: {
  //       contentPoints: {
  //         increment: 10,
  //       }
  //     }
  //   })
  // ])

  res.json(response);
}
