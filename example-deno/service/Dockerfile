# Base image for both Lambda and Fargate
FROM denoland/deno:debian-2.0.0 AS base
WORKDIR /app
COPY . .
# Generate lock file and cache all dependencies
ENV DENO_DIR=/app/deno_dir
RUN mkdir -p /app/deno_dir && \
    deno cache --lock=deno.lock src/index.ts

# Lambda-specific configuration
FROM debian:bookworm-slim AS awsLambda
# Install Deno binary only
COPY --from=denoland/deno:bin-2.0.0 /deno /usr/local/bin/deno
# Copy AWS Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
WORKDIR /app
# Copy app and pre-cached dependencies
COPY --from=base /app .
# Set DENO_DIR for runtime (point to pre-cached directory)
ENV DENO_DIR=/app/deno_dir
# Set port for Lambda Web Adapter
ENV PORT=8080
EXPOSE 8080
# Warm up (optional, shorter timeout to precompile without fetching)
RUN timeout 5s deno run --allow-net --allow-env --allow-read --lock=deno.lock src/index.ts || [ $? -eq 124 ] || exit 1
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--lock=deno.lock", "src/index.ts"]

# Fargate-specific configuration
FROM base AS awsFargateEcs
EXPOSE 8080
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"]