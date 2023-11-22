FROM ubuntu:latest
LABEL authors="gamet"

ENTRYPOINT ["top", "-b"]