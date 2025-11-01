# /Dockerfile  (at repo root)
FROM node:20-alpine AS build
WORKDIR /app
COPY hesham-portfolio/package*.json ./
RUN npm ci
COPY hesham-portfolio/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
