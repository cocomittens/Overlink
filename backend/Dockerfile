# better-sqlite3 is a native module, so we compile it during npm ci.
FROM node:24-slim

# Build tools required to compile better-sqlite3's native bindings.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# App source.
COPY . .

# Fly volume gets mounted at /data (see fly.toml); db.js reads DB_DIR.
ENV DB_DIR=/data
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
