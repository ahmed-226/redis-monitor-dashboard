FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["npm", "start"]