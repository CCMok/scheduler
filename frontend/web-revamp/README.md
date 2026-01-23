# Scheduler Frontend Web

## Getting Started

### Create environment variables

Base on `.env.example`, create `.env` file.

#### Session
Generate random secret. Encode: base64 Length: 32

```bash
openssl rand -base64 32
```

Update `.env` SESSION_SECRET.

### Database operation
Update `.env` DATABASE_URL.

Migrate schema

[dev]
```Nodejs
npx prisma migrate dev --name [migration name]
npx prisma generate
```
[other]
```Nodejs
npx prisma migrate deploy
npx prisma genearte
```

Seed data

```Nodejs
npx prisma db seed
```

#### Database debug
Place at `database-manager.ts`
```Nodejs
// const prisma = globalForPrisma.prisma || new PrismaClient({
//   adapter,
// })

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

// @ts-ignore
prisma.$on('query', (e) => {
  // @ts-ignore
  console.log('Query: ' + e.query)
  // @ts-ignore
  console.log('Params: ' + e.params)
  // @ts-ignore
  console.log('Duration: ' + e.duration + 'ms')
})
```

### Sonarqube
Download latest sonarqube community build.

Start sonarqube server. 

Browse localhost:9000 and set up project.

If not installed sonar in npm:
```Nodejs
npm install -g @sonar/scan
```

Run scan:
```pwsh
sonar "-Dsonar.host.url=http://localhost:9000" "-Dsonar.token=[token]" "-Dsonar.projectKey=[projectKey]"
```