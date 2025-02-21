# Example AI Streaming Application for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) is a powerful tool that simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy an Express-based AI fullstack streaming application that uses Server-Sent Events (SSE) to stream live AI responses from multiple providers (OpenAI and Anthropic). It includes both a front-end and a back-end.The application leverages SCF for local development, flexible compute configurations, and smooth AWS deployments.

<img width="600" alt="Screenshot 2025-02-04 at 4 56 22 PM" src="https://github.com/
user-attachments/assets/4b764c68-c35e-4c46-bf14-bcfc0b6fe49a" />

## Features

- **Express & SSE Streaming:**  
  Leverages Express as the HTTP server and streams AI responses using Server-Sent Events.
- **Multi-Provider Support:**  
  Integrates with both OpenAI and Anthropic APIs to provide AI completions.
- **Node.js Application:**  
  Built with Node.js and modern JavaScript using lightweight frameworks.
- **Compute Flexibility:**  
  Easily switch between AWS Lambda and AWS Fargate ECS deployments via the SCF configuration.
- **Local Development Experience:**  
  SCF provides a rich local development mode that emulates the cloud environment, complete with hot reloading and AWS-like routing.

## Prerequisites

**Docker:**  
Install and start Docker Desktop. ([Get Docker](https://www.docker.com))

**Serverless Framework:**  
Install the Serverless Framework globally:
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
name: ai-streaming

deployment:
  type: awsApi@1.0

containers:
  service:
    src: ./service
    routing:
      pathPattern: /*
      pathHealthCheck: /health
    environment:
      OPENAI_API_KEY: ${env:OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${env:ANTHROPIC_API_KEY}
    compute:
      type: awsLambda  # or awsFargateEcs
```

This file specifies:
- **Project Name:** Used as a namespace in your AWS account.
- **Deployment Settings:** Configures networking (ALB, VPC) via the AWS API deployment type.
- **Container Details:**  
  - The source code is located in the `./service` directory.
  - A catch-all routing rule (`/*`) is used with a dedicated health check endpoint (`/health`).
  - API keys for OpenAI and Anthropic are injected as environment variables.
  - The compute type is set to `awsLambda` by default (switchable to `awsFargateEcs` as needed).

## Project Structure

A typical project structure looks like this:
```
example-ai-streaming/
├── serverless.containers.yml      # SCF project configuration file
└── service/
    ├── Dockerfile                 # Multi-stage Dockerfile for Lambda and Fargate
    ├── package.json               # Node.js project configuration and dependencies
    ├── .env                       # Environment variables (not committed)
    └── src/
        ├── index.js               # Main Express application entrypoint
        ├── routes/                # API route definitions (including AI streaming endpoint)
        ├── middleware/            # Custom middleware (error handling, etc.)
        └── public/                # Static assets (HTML, CSS, JS, images)
```

## Development

SCF provides a local development mode that emulates AWS routing, Lambda, and ECS Fargate environments. To start the development mode (with hot reloading on file changes), run:

```bash
serverless dev
```

Additionally, you can run the application directly using:
```bash
npm start
```

## Deployment

Deploy your AI streaming application to AWS with:
```bash
serverless deploy
```

During deployment, SCF builds the container image (using the provided Dockerfile) and provisions AWS resources (ALB, VPC, Lambda function or ECS service) automatically.

## Cleanup

To remove deployed AWS resources when they are no longer needed:
```bash
serverless remove
```

For complete cleanup (including shared infrastructure):
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Express Documentation](https://expressjs.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
