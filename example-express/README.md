# Express Application Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy a simple Express-based web application using SCF. The application sets up basic routes—including a health check, static file delivery, and a fallback 404 page—with minimal configuration.

## Features

- **Express Framework:**  
  Leverages Express for routing and middleware handling.
- **Static File Serving:**  
  Serves static assets from a dedicated public directory.
- **Health Check Endpoint:**  
  Provides a simple `/health` route for monitoring application health.
- **Flexible Compute Options:**  
  Easily switch between AWS Lambda and AWS Fargate ECS deployments via SCF configuration.

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
Properly configure your AWS credentials (via environment variables or AWS profiles) to allow SCF to provision and update AWS resources.

## Configuration

At the project root, the `serverless.containers.yml` file defines the SCF configuration:

```yaml
name: express

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
- **Project Namespace:** The project name (express) is used as a namespace in your AWS account.
- **Deployment Settings:** Configures networking (ALB, VPC, API Gateway) via the AWS API deployment type.
- **Container Details:**  
  - The source code is located in the `./service` directory.
  - A catch-all routing rule (`/*`) is used with a dedicated health check endpoint (`/health`).
  - An environment variable (`HELLO`) is provided.
  - The compute type is set to `awsLambda` by default (switchable to `awsFargateEcs` as needed).

## Project Structure

A typical project structure for this Express example:
```
example-express/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── package.json                # Node.js project configuration and dependencies
    └── src/
        ├── index.js                # Main Express application entrypoint
        └── public/                 # Static assets (HTML, CSS, images, etc.)
```

## Development

For local development, use Serverless Container Framework's development mode:
```bash
serverless dev
```

This will automatically start everything and set up hot reloading.

## Deployment

Deploy your Express application to AWS by running:
```bash
serverless deploy
```

During deployment, SCF builds the container image (using the provided multi-stage Dockerfile) and provisions the necessary AWS resources (ALB, VPC, Lambda function or ECS Fargate service).

## Cleanup

To remove deployed AWS resources when they are no longer needed:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Express Documentation](https://expressjs.com)
- [Docker Documentation](https://docs.docker.com)
- [AWS Lambda Documentation](https://aws.amazon.com/lambda)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate) 