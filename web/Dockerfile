FROM node:22-alpine AS builder
COPY . .
RUN npm install -g pnpm 
RUN pnpm install --frozen-lockfile 
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf