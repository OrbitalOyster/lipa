FROM oven/bun AS build
ARG VITE_AUTH_API
WORKDIR /usr/src/app

COPY . .

RUN bun install --production --frozen-lockfile
RUN bun run build

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
