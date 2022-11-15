import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'MoralisAuth',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      authorize: async (credentials, _req) => {
      // async authorize(credentials) {
        try {

          // console.log('authorize')
          // "message" and "signature" are needed for authorisation
          // we described them in "credentials" above
          const { message, signature } = credentials;

          await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

          const { address, profileId } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
          ).raw;

          const userDB = await prisma.user.findUnique({
            where: { wallet: address },
          })

          // console.log(userDB)

          const name = userDB?.name
          //address is the wallet - can I connect that to the db?
          const user = { address, profileId, signature, name };
          // returning the user object and creating  a session

          // console.log("Authorize User " + name)
          return user;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  // adapter: PrismaAdapter(prisma),
  // secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user }) {

      console.log("JWT User " + user)
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;

      console.log("Session User " + session.user.name)

      const chain = EvmChain.POLYGON;

      if (!session) {
        return {
          redirect: {
            destination: '/signin',
            permanent: false,
          },
        };
      }

      await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

      const contract = '0x33e1e8877c94a6524983487e37d9dedaea244b84'

      let nftList = []
      nftList = await Moralis.EvmApi.nft.getWalletNFTs({
        address: session.user.address,
        chain: chain
      });

      session.nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

      return session;
    },
  },
};
