FROM oven/bun AS base
WORKDIR /usr/src/app

COPY package.json .
COPY bun.lock .
COPY . .

RUN bun install --production
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src" ]
