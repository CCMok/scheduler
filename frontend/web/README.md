# Scheduler Frontend Web

## Getting Started

### Create environment variables

Base on `.env.example`, create `.env` file.

### Database operation

Migrate schema

```Nodejs
yarn migrate
```

Seed data

```Nodejs
yarn seed-system
yarn seed-[tenant]
```