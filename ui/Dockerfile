# ---- base ----
FROM node:14-alpine AS base

WORKDIR /app

# ---- dependencies ----
FROM base as dependencies

COPY tsconfig.json ./
COPY yarn.lock ./
COPY package.json ./
COPY webpack.config.js ./

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache && \
    rm -rf ./ycache

# ---- development ----
FROM dependencies as development

ENV NODE_ENV=development

CMD node_modules/.bin/webpack --mode=development --watch
