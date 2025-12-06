FROM node:20 AS builder

ARG VITE_OIDC_AUTHORITY=https://auth-dev.snowse.io/realms/secretarai
ARG VITE_OIDC_CLIENT_ID=secretarai-client
ARG VITE_OIDC_REDIRECT_URI=https://secretarai.duckdns.org/auth/callback

ENV VITE_OIDC_AUTHORITY=${VITE_OIDC_AUTHORITY}
ENV VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID}
ENV VITE_OIDC_REDIRECT_URI=${VITE_OIDC_REDIRECT_URI}

COPY . .
RUN npm install -g pnpm 
RUN pnpm install --frozen-lockfile 
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf