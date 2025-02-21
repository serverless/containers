# React Router V7 Application Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy a full‑stack React application using React Router v7 for dynamic routing and server-side rendering (SSR). It is optimized for deployment on AWS Fargate ECS to handle potentially large HTML responses.

## Features

- **React Router v7:**  
  Utilizes React Router v7 for advanced routing and SSR capabilities.
- **Full‑Stack React Application:**  
  Combines client‑side navigation with server‑side rendering for optimal performance.
- **Optimized Bundling:**  
  Built using modern bundling tools (e.g., Vite and React Router dev) for efficient production builds.
- **Flexible Compute Options:**  
  Configured for AWS Fargate ECS to manage larger HTML responses beyond AWS Lambda's limits.

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
Set up your AWS credentials (via environment variables or profiles) for SCF deployments.

## Configuration

The SCF configuration is defined in the `serverless.containers.yml` file at the project root:

```yaml
name: rrouter-v7

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
      # awsLambda is not recommended for react-router-v7
      # due to potential large HTML responses.
      type: awsFargateEcs
```

## Project Structure

A typical project structure for this React Router v7 example:
```
example-react-router-v7/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── package.json                # Project configuration and dependencies
    ├── Dockerfile                  # Dockerfile for building the application container
    └── app/                        # Application source code
        ├── routes/                # React Router route components
        ├── welcome/               # Welcome components and assets
        ├── app.css                # Main CSS styles (e.g., Tailwind CSS)
        ├── root.tsx               # Root component and layout
        └── (other assets and configuration files)
```

## Development

For local development, use Serverless Container Framework's development mode:
```bash
serverless dev
```
This will automatically start the development environment with hot reloading and AWS-like routing. It detects the dev npm script and uses that for hot reloading.

## Deployment

Deploy your React Router v7 application to AWS by running:
```bash
serverless deploy
```
SCF builds the container image using Docker multi-stage builds and provisions the necessary AWS resources (ALB, VPC, and ECS Fargate service).

## Cleanup

To remove the deployed AWS resources, run:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [React Router v7 Documentation](https://reactrouter.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev)
- [Docker Documentation](https://docs.docker.com)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate) 