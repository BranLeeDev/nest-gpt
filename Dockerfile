FROM node:20.13.1-alpine3.19 AS base

ENV DIR /nest-gpt

WORKDIR $DIR

RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init


FROM base AS build

RUN corepack enable pnpm

COPY package.json     $DIR/package.json
COPY pnpm-lock.yaml   $DIR/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY tsconfig.json        $DIR/tsconfig.json
COPY tsconfig.build.json  $DIR/tsconfig.build.json
COPY .swcrc               $DIR/.swcrc
COPY nest-cli.json        $DIR/.nest-cli.json
COPY src                  $DIR/src

RUN pnpm build && \
    pnpm store prune && \
    rm -rf node_modules && \
    pnpm install --prod --frozen-lockfile


FROM base AS production

ENV NODE_ENV="production"

COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist         $DIR/dist

EXPOSE ${PORT}

USER node

ENTRYPOINT [ "dumb-init", "--" ]

CMD [ "node", "dist/main.js" ]
