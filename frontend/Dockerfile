# --------------------
# 1) Build stage
# --------------------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # copy package files
    COPY package*.json ./
    
    # install deps
    RUN npm install
    
    # copy source
    COPY . .
    
    # build nextjs
    RUN npm run build
    
    
    # --------------------
    # 2) Run stage
    # --------------------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # copy only necessary files
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public

    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    