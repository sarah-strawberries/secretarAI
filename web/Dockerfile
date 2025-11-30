FROM node:22-alpine AS builder

ARG VITE_OIDC_AUTHORITY
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_REDIRECT_URI

ENV VITE_OIDC_AUTHORITY=https://auth-dev.snowse.io/realms/secretarai
ENV VITE_OIDC_CLIENT_ID=secretarai-client
ENV VITE_OIDC_REDIRECT_URI=https://secretarai.duckdns.org/auth/callback

COPY . .
RUN npm install -g pnpm 
RUN pnpm install --frozen-lockfile 
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf