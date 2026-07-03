# -----------------------------------------------------------------------------
# docker/app-under-test.Dockerfile — Cypress Real World App (the app we test)
# -----------------------------------------------------------------------------
# This repository is a TEST showroom, not the application itself. Rather
# than requiring a manual `git clone` step before `docker compose up`, this
# Dockerfile clones the official Cypress Real World App at build time, so
# the whole stack is reproducible with a single command.
# -----------------------------------------------------------------------------
FROM node:20-alpine

LABEL description="Cypress Real World App — application under test"

# git is required to clone the app; python3/make/g++ are required to build
# a couple of native Node dependencies used by the RWA backend.
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Shallow clone: we only need the latest state of the app, not its history.
RUN git clone --depth 1 https://github.com/cypress-io/cypress-realworld-app.git .

# Yarn Classic is required by this specific app (see its own README).
RUN corepack enable && yarn install --frozen-lockfile

# Frontend (Vite dev server) and backend (Express API) ports
EXPOSE 3000 3001

# Runs both frontend and backend in watch mode, exactly like local `yarn dev`
CMD ["yarn", "dev"]
