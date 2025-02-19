FROM oven/bun
WORKDIR /usr/src/app

COPY . .

RUN bun install --production
ENTRYPOINT ["bun", "run", "src"]
