# -----------------------------
# Stage 1: Build FRONTEND
# -----------------------------
FROM node:20-alpine AS frontend-build
 
WORKDIR /frontend
 
COPY package*.json ./
RUN npm install
 
COPY . .
RUN npm run build
 
 
# -----------------------------
# Stage 2: Build BACKEND
# -----------------------------
FROM node:20-alpine AS backend-build
 
WORKDIR /backend
 
COPY backend/package.json .
COPY backend/tsconfig.json .
RUN npm install
 
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/db ./db
 
RUN npm run build
 
 
# -----------------------------
# Stage 3: Final runtime image
# -----------------------------
FROM alpine:3.18
 
# Install nginx + node + supervisor
RUN apk add --no-cache nodejs npm nginx supervisor
 
# Create app directories
RUN mkdir -p /var/log/supervisor
 
# -----------------------------
# FRONTEND COPY
# -----------------------------
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# -----------------------------
# BACKEND COPY
# -----------------------------
WORKDIR /backend
COPY backend/package.json .
RUN npm install --omit=dev
COPY --from=backend-build /backend/dist ./dist
 
ENV PORT=3001
 
# -----------------------------
# SUPERVISORD
# -----------------------------
COPY supervisord.conf /etc/supervisord.conf
 
EXPOSE 80 3001
 
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]