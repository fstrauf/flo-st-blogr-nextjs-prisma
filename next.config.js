// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  reactStrictMode: true,
  assetPrefix: "./",
}


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     swcPlugins: [
//       [
//         'next-superjson-plugin',
//         {
//           excluded: [],
//         },
//       ],
//     ],
//   },
// }

// module.exports = nextConfig
