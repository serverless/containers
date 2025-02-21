# Hono Application Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy a Hono-based web application using SCF. Hono is a lightweight framework for building fast HTTP services. The application sets up basic routes—including static file delivery, a health check, and a fallback 404 page—and can be deployed on AWS Lambda or AWS Fargate ECS with minimal configuration.

## Features

- **Hono Framework:**  
  Leverages Hono for a fast and minimalistic HTTP service.
- **Static File Serving:**  
  Serves static content from a dedicated public directory.
- **Health Check Endpoint:**  
  Provides a reliable `/health` route to verify application status.
- **Flexible Compute Options:**  
  Easily deployable as an AWS Lambda function or on AWS Fargate ECS.
- **Lightweight & Efficient:**  
  Designed for minimal overhead and optimal performance in a containerized environment.

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
Properly configure your AWS credentials (via environment variables or AWS profiles) to enable SCF to provision and update AWS resources.

## Configuration

At the project root, the `serverless.containers.yml` file defines the SCF configuration:

```yaml
name: hono

deployment:
  type: awsApi@1.0

containers:
  service:
    src: ./service
    routing:
      pathPattern: /*
      pathHealthCheck: /health
    environment:
      HELLO: world
    compute:
      type: awsLambda  # or awsFargateEcs
```

This configuration sets:
- **Project Namespace:** The project name (hono) is used to namespace resources in your AWS account.
- **Deployment Settings:** Configures networking via the AWS API deployment type.
- **Container Details:**  
  - The source code is located in the `./service` directory.
  - A catch-all routing rule (`/*`) is used with a designated health check endpoint (`/health`).
  - An environment variable (`HELLO`) is provided.
  - The compute type is set to `awsLambda` by default (or can be switched to `awsFargateEcs`).

## Project Structure

A typical project structure for this Hono example:
```
example-hono/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── package.json                # Node.js project configuration and dependencies
    └── src/
        ├── index.js                # Main Hono application entrypoint
        └── public/                 # Static assets (HTML, CSS, images, etc.)
```

## Development

For local development, you can run the Hono application using SCF's development mode which emulates AWS routing and compute environments:
```bash
serverless dev
```

This will automatically start everything and set up hot reloading.

## Deployment

Deploy your Hono application to AWS using:
```bash
serverless deploy
```

During deployment, SCF builds the container image (using the provided multi-stage Dockerfile) and provisions the necessary AWS resources (ALB, VPC, Lambda function, or ECS Fargate service).

## Cleanup

To remove deployed AWS resources when they are no longer needed, run:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Hono Documentation](https://hono.dev)
- [Docker Documentation](https://docs.docker.com)
- [AWS Lambda Documentation](https://aws.amazon.com/lambda)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate) 