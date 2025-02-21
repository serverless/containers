# Next.js Application Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy a Next.js web application using SCF. Due to the potential for large SSR outputs, this project is configured for deployment on AWS Fargate ECS.

## Features

- **Next.js Framework:**  
  Leverages Next.js for server-side rendering (SSR) and static site generation.
- **Dynamic Routing & SSR:**  
  Provides robust routing and dynamic page generation.
- **Optimized Production Builds:**  
  Docker multi-stage builds ensure efficient deployments.
- **Flexible Compute Options:**  
  Configured for AWS Fargate ECS to handle large HTML responses.

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
Configure your AWS credentials (via environment variables or profiles) for SCF deployments.

## Configuration

At the project root, the `serverless.containers.yml` file defines the SCF configuration:

```yaml
name: nextjs

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
      # awsLambda is not recommended for this Next.js app. 
      # SSR can generate large HTML responses, which may exceed 
      # the req/res size limits for AWS Lambda.
      type: awsFargateEcs
```

## Project Structure

A typical project structure for this Next.js example:
```
example-nextjs/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── next.config.ts              # Next.js configuration file
    ├── package.json                # Project configuration and dependencies
    ├── public/                     # Static assets (images, CSS, etc.)
    └── src/
        ├── app/                   # Next.js app folder (pages, components, etc.)
        └── (other directories)     # Additional assets and logic
```

## Development

For local development, use Serverless Container Framework's development mode:
```bash
serverless dev
```
This will automatically start the Next.js development server with hot reloading and AWS emulation. It detects the dev npm script and uses that for hot reloading.

## Deployment

Deploy your Next.js application to AWS by running:
```bash
serverless deploy
```
SCF builds the container image (using the provided multi-stage Dockerfile) and provisions the necessary AWS resources.

## Cleanup

To remove the deployed AWS resources, run:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate) 