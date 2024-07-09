FROM node:18.12.0 as build

ARG NPM_CONFIG

WORKDIR /build

RUN echo "$NPM_CONFIG" > .npmrc

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build

# Only install production required packages
RUN rm -rf node_modules && yarn install --prod && rm .npmrc

### Package stage

FROM node:18.12.0-alpine3.16
WORKDIR /usr/src/app

# Only copy production required files
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/package.json .

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
