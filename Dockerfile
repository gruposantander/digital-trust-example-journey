FROM node:12-alpine

ARG NPM_TOKEN

RUN adduser -D -u 1001 demo
USER 1001

WORKDIR /home/demo

ENV TZ="Europe/London" \
    NODE_ENV=production \
    STATICS_FOLDER="/demo"

COPY backend/package*json ./
COPY backend/.npmrc .
RUN npm install
COPY backend/app.js .
COPY backend/private.json .
COPY dist/digital-id-example-frontend ./demo
USER 0
RUN chown -R demo /home/demo
USER 1001

EXPOSE 4201
CMD [ "node", "app.js" ]

