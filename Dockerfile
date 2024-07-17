FROM node:21
ENV NODE_ENV=build
USER node
WORKDIR /home/node
ADD backend .
RUN npm ci
RUN npm run build

FROM node:21
WORKDIR /app
COPY frontend /app
RUN npm ci
RUN npm run build

FROM node:21
ENV NODE_ENV=production
USER node
WORKDIR /home/node
COPY --from=0 /home/node/package*.json ./
COPY --from=0 /home/node/node_modules ./node_modules/
COPY --from=0 /home/node/dist ./dist/
COPY --from=1 /app/dist ./static
CMD ["node", "dist/main.js"]