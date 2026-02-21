FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env* ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "await fetch('http://localhost:3000/api/health').then(r => { if (!r.ok) throw new Error(); })"

CMD ["bun", "run", "dist/server/index.js"]
