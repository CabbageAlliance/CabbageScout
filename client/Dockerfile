FROM node:13.8.0-alpine

WORKDIR /usr/src/app

# This enables automatic optimizations in packages that support it
ENV NODE_ENV=production

# Run update and upgrade/install in the same step to avoid reusing an old package cache from `apk update`
RUN apk update \
	&& apk add yarn

# Copy package metadata and dependency lockfile
COPY package.json yarn.lock ./

RUN yarn install --production=true

# Copy Next.js configuration
COPY next.config.js ./

# Copy public assets
COPY public ./public

# Copy application source
COPY src ./src

# Build the project
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
