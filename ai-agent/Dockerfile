# -----------------------------------------------------------------------------
# ai-agent/Dockerfile — LangGraph agent image
# -----------------------------------------------------------------------------
# Separate, lightweight image from the Cypress one on purpose: the agent
# only needs Python + a few libraries, not a full browser stack. Keeping it
# isolated makes the image ~10x smaller and lets it be rebuilt/deployed
# independently of the test runner.
#
# Build context is expected to be the REPOSITORY ROOT (see docker-compose.yml),
# so this Dockerfile can also read cypress/features/ at build/run time.
# -----------------------------------------------------------------------------
FROM python:3.11-slim

LABEL maintainer="Khalid Hafid-Medheb" \
      description="LangGraph agent: Gherkin -> Cypress spec generation & self-healing"

WORKDIR /app

# Install dependencies first for the same Docker-layer-caching reason as
# the main Dockerfile: this layer is only invalidated when requirements
# actually change.
COPY ai-agent/requirements.txt ./ai-agent/requirements.txt
RUN pip install --no-cache-dir -r ai-agent/requirements.txt

# Copy the agent source code and the Gherkin features it reads from
COPY ai-agent ./ai-agent
COPY cypress/features ./cypress/features

WORKDIR /app/ai-agent

# No default --feature argument on purpose: the caller (docker-compose,
# CI, or a human) must specify which .feature file to process.
ENTRYPOINT ["python", "cli.py"]
