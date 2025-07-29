import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Workaround for Vercel + Prisma + Monorepos (Multi app in 1 repo) issue (https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel)
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
};

export default nextConfig;
