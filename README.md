# Node.js & Express Backend

[![Node CI](https://github.com/cutechybyke/Node.js-and-Express.js-Backend/actions/workflows/ci.yml/badge.svg)](https://github.com/cutechybyke/Node.js-and-Express.js-Backend/actions/workflows/ci.yml)

A REST backend built with **Node.js, Express and MongoDB/Mongoose**, with JWT-based authentication, role-aware authorization and refresh-token sessions.

## Highlights

- JWT access and refresh token authentication
- Password hashing with bcrypt
- MongoDB persistence through Mongoose
- Role-aware authorization
- HTTP-only refresh-token cookies
- Central Express middleware structure
- Automated authentication tests with Node's built-in test runner
- GitHub Actions CI

## Stack

Node.js · Express · MongoDB · Mongoose · JSON Web Tokens · bcrypt · CORS

## Getting started

```bash
git clone https://github.com/cutechybyke/Node.js-and-Express.js-Backend.git
cd Node.js-and-Express.js-Backend
npm install
```

Create a `.env` file containing the configuration expected by the application, including the MongoDB connection string and JWT secrets, then run:

```bash
npm run dev
```

For a normal production-style start:

```bash
npm start
```

## Tests

```bash
npm test
```

The CI workflow runs the automated test suite for pushes and pull requests.

## Engineering improvements

Recent work on the project strengthened authentication input validation, JWT configuration handling, refresh-token cookie behavior and error handling. Regression tests and CI were added as a separate follow-up change so those behaviors remain verifiable.
