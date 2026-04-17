# --- Build stage ---
FROM golang:1.24-alpine AS builder

RUN go install github.com/a-h/templ/cmd/templ@v0.3.1001

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN templ generate
RUN CGO_ENABLED=0 go build -o /app/server .

# --- Runtime stage ---
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/static ./static

EXPOSE 3000

CMD ["./server"]
