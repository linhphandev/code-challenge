## Description

It is a app using Nest.js framework and MongoDB(Mongoose). You can:

1. Create a resource (fields: name, description).
2. List resources with basic filters (filter by name).
3. Get details of a resource.
4. Update resource details.
5. Delete a resource.

See OpenAPI(Swagger) http://localhost:3000/docs

## Installation

```bash
$ yarn
```

## Requirements

- Node version >= 18.12.0
- MongoDB
- NestJS cli

  ```bash
  npm install -g @nestjs/cli
  ```

## Running the app

Create `.env` file

```bash
# Copy from .env.example
$ cp .env.example .env
```

Start the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Environments

```bash
# System
NODE_ENV=local / development / staging / production
PORT=3000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/resource_management
```
