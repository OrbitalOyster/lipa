FROM oven/bun
WORKDIR /usr/src/app

COPY . .

RUN bun install --production --frozen-lockfile
ENTRYPOINT ["bun", "run", "src"]
