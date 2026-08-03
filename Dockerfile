FROM node:24 AS backend-build
ENV NODE_ENV=build
USER node
WORKDIR /home/node
ADD backend .
RUN npm ci
RUN npm run build

# TODO: still on EOL Node 21 — bump together with the frontend dependency update.
FROM node:21 AS frontend-build
WORKDIR /app
COPY frontend /app
RUN npm ci
RUN npm run build

FROM node:24
ENV NODE_ENV=production
USER node
WORKDIR /home/node
COPY --from=backend-build /home/node/package*.json ./
COPY --from=backend-build /home/node/node_modules ./node_modules/
COPY --from=backend-build /home/node/dist ./dist/
COPY --from=frontend-build /app/dist ./static
CMD ["node", "dist/main.js"]