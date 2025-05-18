# Scheduler Frontend Web

## Getting Started

### Create environment variables

Base on `.env.example`, create `.env` file.

#### JWT Secret

Generate random secret. Encode: base64 Length: 32

```bash
openssl rand -base64 32
```

### Database operation

Migrate schema

```Nodejs
yarn migrate
```

Seed data

```Nodejs
yarn seed-system
yarn seed-tenant
```