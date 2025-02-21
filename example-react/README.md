# React Application Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) streamlines the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy a React application using SCF. The application is bundled using esbuild and optimized for production deployments on AWS Fargate ECS.

## Features

- **React Framework:**  
  Builds a client-side React application with a component-based architecture.
- **Fast Bundling with esbuild:**  
  Uses esbuild for rapid development builds and efficient bundling.
- **Static Asset Serving:**  
  Supports serving static assets and client-side routing.
- **Flexible Compute Options:**  
  Configured for AWS Fargate ECS to accommodate larger bundle sizes that might exceed AWS Lambda request/response limits.

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
Set up your AWS credentials (via environment variables or profiles) for SCF deployment.

## Configuration

The SCF configuration is defined in the `serverless.containers.yml` file at the project root:

```yaml
name: react

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
      # awsLambda is not recommended for this React app.
      # The bundled app may exceed AWS Lambda's request/response size limits.
      type: awsFargateEcs
```

## Project Structure

A typical project structure for this React example:
```
example-react/
├── serverless.containers.yml      # SCF configuration file
└── service/
    ├── package.json                # Project configuration and dependencies
    ├── public/                     # Static assets (HTML, CSS, images, etc.)
    ├── server.js                   # Server entrypoint for serving the React app
    └── src/
        ├── index.jsx              # React application entrypoint
        └── (other components)      # React components and logic
```

## Development

For local development, use Serverless Container Framework's development mode:
```bash
serverless dev
```
This will automatically start the development environment with hot reloading and AWS-like routing.

## Deployment

Deploy your React application to AWS by running:
```bash
serverless deploy
```
SCF takes care of building the container image (using the provided Dockerfile) and provisioning the necessary resources.

## Cleanup

To remove the deployed AWS resources, run:
```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [esbuild Documentation](https://esbuild.github.io)
- [Docker Documentation](https://docs.docker.com)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate) 