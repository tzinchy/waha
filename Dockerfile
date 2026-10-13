# RTS «Латунный Собор»: сборка клиента + сервер (WebSocket, авторитетная симуляция).
# docker build -t waha . && docker run -p 8080:8080 waha  →  http://localhost:8080

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY client ./client
COPY shared ./shared
COPY server ./server
RUN npm run check && npm test && npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY shared ./shared
COPY server ./server
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:'+process.env.PORT).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "tsx", "server/index.ts"]
