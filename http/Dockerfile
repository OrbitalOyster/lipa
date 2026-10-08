# Build executable
FROM golang:1.27 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 go build -o http . # CGO_ENABLED=0 to disable C dependencies
# Run executable
FROM scratch
COPY --from=build . .
ENTRYPOINT ["/app/http"]
