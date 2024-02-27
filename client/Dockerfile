FROM golang:alpine AS build
RUN mkdir /src
ADD . /src
WORKDIR /src
RUN go build -o /tmp/http-server ./main.go

FROM alpine:edge
COPY --from=build /tmp/http-server /sbin/http-server
ADD /views ./views
ENV HELLO_MESSAGE ${HELLO_MESSAGE}
CMD /sbin/http-server