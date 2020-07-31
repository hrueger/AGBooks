FROM tarampampam/node:13.1-alpine

LABEL maintainer="Hannes Rüger"
LABEL name="AGBooks"

RUN mkdir -p /app/config && mkdir /app/dist && mkdir /app/data
COPY api /app/dist
COPY frontend /app/dist/frontend
COPY backend /app/dist/backend

EXPOSE 80
CMD    ["node", "/app/dist/index.js"]
