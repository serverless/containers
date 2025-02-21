# Base image for both Lambda and Fargate
FROM node:20-alpine as base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Lambda-specific configuration
FROM base as lambda
# Install AWS Lambda Web Adapter
RUN apk add --no-cache curl && \
    curl -Lo /usr/local/bin/aws-lambda-web-adapter \
    https://github.com/awslabs/aws-lambda-web-adapter/releases/latest/download/aws-lambda-web-adapter && \
    chmod +x /usr/local/bin/aws-lambda-web-adapter

EXPOSE 8080
CMD ["aws-lambda-web-adapter", "--port", "8080", "--", "npm", "start"]

# Fargate-specific configuration
FROM base as fargate
EXPOSE 8080
CMD ["npm", "start"]
