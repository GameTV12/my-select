###### [STAGE] Build ######
FROM node:18-alpine AS builder
WORKDIR /app
ENV CI=true

### Install dependencies ###
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

### Build ###
COPY ./nest-cli.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./src ./src/
COPY ./prisma ./prisma/

RUN npm run prisma
RUN npm run build

###### [STAGE] Application ######
FROM node:18-alpine as app
WORKDIR /app

### Install production dependencies ###
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --omit=dev

### Copy dist and start ###
COPY --from=builder /app/dist ./dist/

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]