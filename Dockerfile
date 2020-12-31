FROM golang:alpine as server-builder

ARG GOLANG_NAMESPACE="github.com/mohemohe/parakeet"
ENV GOLANG_NAMESPACE="$GOLANG_NAMESPACE"

RUN apk --no-cache add alpine-sdk coreutils git tzdata nodejs upx util-linux yarn zsh
SHELL ["/bin/zsh", "-c"]
RUN cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
RUN go get -u -v github.com/pwaller/goupx
RUN wget https://github.com/swaggo/swag/releases/download/v1.6.5/swag_1.6.5_Linux_x86_64.tar.gz
RUN tar xvzf swag_1.6.5_Linux_x86_64.tar.gz
RUN chmod +x swag
RUN mv swag /tmp/
WORKDIR /go/src/$GOLANG_NAMESPACE/server
ADD ./server/go.mod /go/src/$GOLANG_NAMESPACE/server/
ADD ./server/go.sum /go/src/$GOLANG_NAMESPACE/server/
ENV GO111MODULE=on
RUN go mod download
ADD . /go/src/$GOLANG_NAMESPACE/
RUN /tmp/swag init
RUN go build -ldflags "\
      -w \
      -s \
    " -o /parakeet/app
RUN goupx /parakeet/app

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
