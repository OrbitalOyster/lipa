FROM oven/bun AS build
WORKDIR /usr/src/app

COPY . .

RUN bun install
RUN bun run build

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
