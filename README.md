# Scheduler

## Deployment Strategy
### Backend - SCH
Render - supporting Python web apps
- Deployment:
  - Push FastAPI code to a GitHub repository.
  - Create a Render Web Service, select Python 3 runtime, and specify pip install -r requirements.txt for the build command and gunicorn or uvicorn for the start command (e.g., gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app).
  - Configure environment variables (e.g., database URL) in Render’s dashboard.
- Cost:
  - Free Tier: Free web services with 512 MB RAM, 0.5 CPU, and auto-scaling (sleeps after 15 minutes of inactivity). Suitable for UAT with low traffic.
  - Paid Tier: Starts at $7/month for a Starter instance (1 GB RAM, 1 CPU) for production. Scales up to $425/month for higher resources.
- UAT: Use the free tier for low-traffic testing.
- Production: Use a Starter or higher instance for reliable performance and uptime.
- Pros:
  - Simple setup for FastAPI with automatic scaling.
  - Free tier for UAT reduces costs.
  - Built-in CI/CD with GitHub integration.
- Cons:
  - Free tier instances sleep, causing cold starts (~1-2 seconds delay).
  - Limited resources in free tier may not suit high-traffic production.dev.tofreecodecamp.org

### Frontend - Web
Vercel - optimized for Next.js
- Deployment:
  - Push your Next.js code to a GitHub repository.
  - Connect the repository to Vercel, configure environment variables, and deploy - with npm run build.
  - Vercel handles static site generation, server-side rendering, and client-side - rendering automatically.
- Cost:
  - Free Tier: Vercel’s Hobby plan is free for non-commercial use, includes 1 project, 1 user, and generous bandwidth (100 GB/month). Suitable for UAT.
  - Paid Tier: Pro plan starts at $20/month per user, with higher bandwidth and team features for production.
- UAT: Use the free Hobby plan with a separate Git branch (e.g., staging) for testing.
- Production: Upgrade to the Pro plan for higher traffic, custom domains, and SLAs.
- Pros:
  - Excellent Next.js integration with zero-config deployment.
  - Free tier sufficient for UAT and small-scale production.
  - Automatic scaling with no server management.
- Cons:
  - Limited to frontend hosting; FastAPI requires a separate platform.
  - File size limits (100 MB) may restrict backend deployments if bundled with Next.js.

### Database
Neon - serverless PostgreSQL platform
- Deployment:
  - Sign up at neon.tech and create a PostgreSQL project.
  - Copy the DATABASE_URL from Neon’s dashboard.
  - Configure Vercel and Render with the DATABASE_URL.
  - Run Prisma migrations via GitHub Actions or locally, similar to Render.
  - Neon supports branching (e.g., separate UAT and production databases), which aligns with your staging and main Git branches.
- Cost:
  - UAT: Free tier (0.5 GB storage, 10 compute hours/month, no expiration).
  - Production: Pro plan ($15/month, 1 GB storage, 300 compute hours/month, scalable).
- Prisma Compatibility:
  - Neon is designed for serverless environments, with built-in connection pooling for Prisma in Vercel.
  - Supports ?pgbouncer=true in DATABASE_URL for automatic connection management (e.g., postgres://user:password@host:port/dbname?pgbouncer=true).
  - Official Prisma integration (Neon provides tutorials and CLI tools for migrations).
- Integration:
  - Works well with Vercel (low latency for serverless connections).
  - FastAPI on Render can connect to Neon’s public endpoint, though latency may be slightly higher than Render’s internal networking.
  - Branching allows isolated UAT and production databases without additional instances.
- Pros:
  - Generous free tier with no expiration, ideal for UAT.
  - Serverless-native with built-in pooling, perfect for Prisma in Vercel.
  - Database branching simplifies UAT/production separation.
- Cons:
  - Slightly higher production cost ($15/month vs. Render’s $7/month).
  - External connections from Render may require public access or VPC peering (additional setup).
- Suitability: Ideal for Prisma-heavy Next.js projects due to serverless compatibility and free tier flexibility. Great if you prioritize Prisma performance over Render ecosystem integration.