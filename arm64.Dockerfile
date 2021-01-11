FROM golang:alpine as server-builder

ARG GOLANG_NAMESPACE="github.com/mohemohe/parakeet"
ENV GOLANG_NAMESPACE="$GOLANG_NAMESPACE"

RUN apk --no-cache add alpine-sdk coreutils git tzdata nodejs util-linux yarn zsh
SHELL ["/bin/zsh", "-c"]
RUN cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
RUN go get -u -v github.com/pwaller/goupx
RUN go get -u -v github.com/swaggo/swag/cmd/swag
WORKDIR /go/src/$GOLANG_NAMESPACE/server
ADD ./server/go.mod /go/src/$GOLANG_NAMESPACE/server/
ADD ./server/go.sum /go/src/$GOLANG_NAMESPACE/server/
ENV GO111MODULE=on
RUN go mod download
ADD . /go/src/$GOLANG_NAMESPACE/
RUN swag init --parseDependency --parseInternal --parseDepth 3
RUN go build -ldflags "\
      -w \
      -s \
    " -o /parakeet/app

# ====================================================================================

FROM node:14-alpine as client-builder

ARG GOLANG_NAMESPACE="github.com/mohemohe/parakeet"
ENV GOLANG_NAMESPACE="$GOLANG_NAMESPACE"

RUN apk --no-cache add alpine-sdk coreutils git python tzdata util-linux yarn zsh
SHELL ["/bin/zsh", "-c"]
WORKDIR /go/src/$GOLANG_NAMESPACE/server
ADD . /go/src/$GOLANG_NAMESPACE/
WORKDIR /go/src/$GOLANG_NAMESPACE/client
RUN yarn
RUN yarn build

# ====================================================================================

FROM alpine

ARG GOLANG_NAMESPACE="github.com/mohemohe/parakeet"
ENV GOLANG_NAMESPACE="$GOLANG_NAMESPACE"

RUN apk --no-cache add ca-certificates
COPY --from=server-builder /etc/localtime /etc/localtime
COPY --from=server-builder /parakeet/app /parakeet/app
COPY --from=server-builder /go/src/$GOLANG_NAMESPACE/server/templates /parakeet/templates
COPY --from=client-builder /go/src/$GOLANG_NAMESPACE/server/public /parakeet/public

EXPOSE 1323
WORKDIR /parakeet
CMD ["/parakeet/app"]
