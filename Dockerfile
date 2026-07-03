# -----------------------------------------------------------------------------
# Dockerfile — Cypress test runner image for my-cypress-showroom
# -----------------------------------------------------------------------------
# Based on the OFFICIAL "cypress/included" image, which ships with:
#   - Node.js
#   - Cypress itself, already installed and verified
#   - Every required browser (Electron, Chrome, Firefox) pre-installed
# This is the pattern recommended by the Cypress team for CI/Docker usage:
# it avoids the slow "cypress install" + browser download step that would
# otherwise run on every fresh container / CI job.
#
# Tag is pinned (not "latest") to keep local runs, CI runs and this repo's
# package.json ("cypress": "^14.0.0") in sync and reproducible.
# -----------------------------------------------------------------------------
FROM cypress/included:14.0.0

# Human-readable metadata — useful when the image is listed with `docker images`
LABEL maintainer="Khalid Hafid-Medheb" \
      description="Cypress smoke/regression/API test runner for my-cypress-showroom"

# All subsequent instructions run from this directory inside the container
WORKDIR /app

# Copy only the dependency manifests first. Docker caches this layer, so
# `npm install` only re-runs when package.json actually changes — not on
# every source-code edit. This is the single biggest speed win for CI.
COPY package.json package-lock.json* ./

# --ignore-scripts skips Cypress's own postinstall browser-download step,
# since the base image already provides verified browsers.
RUN npm install --ignore-scripts

# Now copy the actual test suite source code
COPY cypress.config.ts tsconfig.json ./
COPY cypress ./cypress

# Sanity check: confirms the Cypress binary is present, executable, and
# matches the version declared in package.json — fails the build early
# instead of failing silently at test-run time.
RUN npx cypress verify

# Default entrypoint/command run the full suite; individual services in
# docker-compose.yml override the CMD to target smoke/regression/api specs.
ENTRYPOINT ["npx", "cypress"]
CMD ["run"]
