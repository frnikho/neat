FROM oven/bun:1.2.20 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN bun add -g turbo

COPY . .

ENV TURBO_TELEMETRY_DISABLED=1
RUN turbo prune @neat/web --docker

WORKDIR /usr/src/app/out/full

RUN bun i --no-lockfile --production

RUN bun install turbo --dev

FROM install AS build

RUN turbo run build

FROM oven/bun:1.2.20 AS final
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/out/full .

RUN rm -rf node_modules

RUN bun install --production --no-lockfile

ENTRYPOINT ["bun", "./apps/web/.output/server/index.mjs"]