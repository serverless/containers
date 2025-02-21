# Astro Static Site Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy an Astro-based static site that leverages Astro's modern static site generation (with optional SSR) for an optimized production deployment. The application is configured for both AWS Lambda and AWS ECS Fargate deployments using SCF.

## Features

- **Astro Static Site:**  
  Built with Astro to generate a fast, optimized, and zero-JS default static site.
- **Optional Server-Side Rendering:**  
  Supports SSR mode through Astro when dynamic rendering is needed.
- **Zero-JS by Default:**  
  Delivers pure static content with minimal or no client-side JavaScript.
- **Flexible Compute Options:**  
  Easily switch between AWS Lambda and AWS Fargate ECS deployments via SCF configuration.
- **Optimized Production Builds:**  
  Utilizes Docker multi-stage builds and production optimizations for efficient deployment.

## Prerequisites

**Docker:**  
Install and start Docker Desktop. ([Get Docker](https://www.docker.com))

**Serverless Framework:**  
Install globally:
```bash
npm i -g serverless
```

**Node.js & npm:**  
Ensure you have a recent Node.js LTS version installed.

**AWS Credentials:**  
Properly configure your AWS credentials (using environment variables or AWS profiles) to allow SCF to provision and update AWS resources.

## Configuration

At the project root, the `serverless.containers.yml` file defines the SCF configuration:

```yaml
name: astro-static

deployment:
  type: awsApi@1.0

containers:
  service:
    src: ./service
    routing:
      pathPattern: /*
      pathHealthCheck: /health
    environment:
      NODE_ENV: production
      ASTRO_TELEMETRY_DISABLED: 1  # Disable Astro telemetry
    compute:
      type: awsLambda  # or awsFargateEcs
```

This configuration sets:
- **Project Namespace:** The project name is used as a namespace in your AWS account.
- **Deployment Settings:** Configures networking (ALB, VPC, API Gateway) via the AWS API deployment type.
- **Container Details:**  
  - The source code resides in the `./service` directory.
  - A catch-all routing rule (`/*`) is used with a dedicated health check endpoint (`/health`).
  - Environment variables are set for production and to disable Astro telemetry.
  - The default compute type is set to `awsLambda` (switchable to `awsFargateEcs` as needed).

## Project Structure

A typical project structure for this Astro static site example:
```
example-astro-static/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── astro.config.mjs            # Astro configuration file
    ├── package.json                # Node.js project configuration and dependencies
    ├── public/                     # Static assets (images, CSS, etc.)
    └── src/
        ├── pages/                 # Astro pages (including health check and index)
        └── (other directories)    # Additional assets or components
```

## Development

SCF provides a development mode that emulates AWS routing and compute environments:
```bash
serverless dev
```

## Deployment

Deploy your Astro static site to AWS by running:
```bash
serverless deploy
```

During deployment, SCF builds the container image (using the multi-stage Dockerfile) and provisions the necessary AWS resources (ALB, VPC, Lambda function, or ECS Fargate service).

## Cleanup

To remove deployed AWS resources when they are no longer needed, run:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Astro Documentation](https://docs.astro.build)
- [Docker Documentation](https://docs.docker.com)
- [AWS Lambda Documentation](https://aws.amazon.com/lambda)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate)
