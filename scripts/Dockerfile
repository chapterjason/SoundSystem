# ---- base ----
FROM node:14-alpine AS base

WORKDIR /app

RUN apk add --no-cache zip inotify-tools bash

# ---- dependencies ----
FROM base as dependencies

# ---- development ----
FROM dependencies as development

CMD /app/watch.sh

# ---- production ----
FROM dependencies as production

COPY scripts /app/scripts
COPY build.sh /app

CMD /app/build.sh
