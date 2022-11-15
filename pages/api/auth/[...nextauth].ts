import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
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
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const { message, signature } = credentials!;

        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    
        const { address, profileId } = (
          await Moralis.Auth.verify({ message, signature, network: 'evm' })
        ).raw;
    
        const userDB = await prisma?.user.findUnique({
          where: { wallet: address },
        })

        const name = userDB?.name

        // const res = await fetch("/your/endpoint", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const user = await res.json()
        const user = { address, profileId, signature, name };
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        // const user = { address, profileId, signature };
         
  
        // If no error and we have user data, return it
        if (user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }
    ),
  ],


  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt'

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {

      console.log("JWT User " + user)
      user && (token.user = user);
      return token;
    },
    async session({ session, token }: {session: any; token: any}) {
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

      let nftList: any[]
      nftList = await Moralis.EvmApi.nft.getWalletNFTs({
        address: session.user.address,
        chain: chain
      });

      session.nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

      return session;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: false,
})

// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
// export default authHandler;

// const options = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'MoralisAuth',
//       credentials: {
//         message: {
//           label: 'Message',
//           type: 'text',
//           placeholder: '0x0',
//         },
//         signature: {
//           label: 'Signature',
//           type: 'text',
//           placeholder: '0x0',
//         },
//       },
//       authorize: async (credentials, _req) => {
//         // async authorize(credentials) {
//         try {

//           // console.log('authorize')
//           // "message" and "signature" are needed for authorisation
//           // we described them in "credentials" above
//           const { message, signature } = credentials!;

//           await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//           const { address, profileId } = (
//             await Moralis.Auth.verify({ message, signature, network: 'evm' })
//           ).raw;

//           const userDB = await prisma?.user.findUnique({
//             where: { wallet: address },
//           })

//           // console.log(userDB)

//           const name = userDB?.name
//           //address is the wallet - can I connect that to the db?
//           const user = { address, profileId, signature, name };
//           // returning the user object and creating  a session

//           // console.log("Authorize User " + name)
//           return user;
//         } catch (e) {
//           console.error(e);
//           return null;
//         }
//       },
//     }),
//   ],
//   // adapter: PrismaAdapter(prisma),
//   // secret: process.env.SECRET,
//   callbacks: {
//     async jwt({ token, user }: { token: any; user: any }) {

//       console.log("JWT User " + user)
//       user && (token.user = user);
//       return token;
//     },
//     async session({ session, token }: {session: any; token: any}) {
//       session.user = token.user;

//       console.log("Session User " + session.user.name)

//       const chain = EvmChain.POLYGON;

//       if (!session) {
//         return {
//           redirect: {
//             destination: '/signin',
//             permanent: false,
//           },
//         };
//       }

//       await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//       const contract = '0x33e1e8877c94a6524983487e37d9dedaea244b84'

//       let nftList: any[]
//       nftList = await Moralis.EvmApi.nft.getWalletNFTs({
//         address: session.user.address,
//         chain: chain
//       });

//       session.nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

//       return session;
//     },
//   },
// };




// authorize: async (credentials, req) => {
//   // async authorize(credentials) {
//   try {

//     // console.log('authorize')
//     // "message" and "signature" are needed for authorisation
//     // we described them in "credentials" above
//     const { message, signature } = credentials!;

//     await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//     const { address, profileId } = (
//       await Moralis.Auth.verify({ message, signature, network: 'evm' })
//     ).raw;

//     const userDB = await prisma?.user.findUnique({
//       where: { wallet: address },
//     })

//     // console.log(userDB)

//     const name = userDB?.name
//     //address is the wallet - can I connect that to the db?
//     const user = { address, profileId, signature, name };
//     // returning the user object and creating  a session

//     // console.log("Authorize User " + name)
//     if (user) {
//       // Any object returned will be saved in `user` property of the JWT
//       return user
//     } else {
//       // If you return null then an error will be displayed advising the user to check their details.
//       return null

//       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//     }
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// },
