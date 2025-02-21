# Apollo GraphQL API Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) streamlines containerized application development and deployment on AWS Lambda and AWS Fargate ECS.

This example demonstrates building a GraphQL API using Apollo Server with Express integration. It showcases a modern Apollo Server setup complete with a GraphQL schema, resolvers, and a health check endpoint—all deployable via SCF.

## Features

- **Apollo Server & GraphQL:**  
  Leverages Apollo Server 4 to provide a robust GraphQL API.
- **Express Integration:**  
  Uses Express middleware for seamless HTTP handling and CORS support.
- **Node.js Application:**  
  Developed with Node.js using ES module syntax.
- **Flexible Compute Options:**  
  Easily deployable as an AWS Lambda function or on AWS Fargate ECS with a simple configuration change.
- **Local Development:**  
  Utilize SCF's development mode for near-production emulation on your local machine.

## Prerequisites

**Docker:**  
Docker Desktop is required for container builds and local development.  
[Get Docker](https://www.docker.com)

**Serverless Framework:**  
Install globally:
```bash
npm i -g serverless
```

**Node.js & npm:**  
Ensure a recent Node.js LTS version is installed.

**AWS Credentials:**  
Properly configure your AWS credentials (using environment variables or AWS profiles) to enable resource provisioning via SCF.

## Configuration

The SCF configuration is defined in the `serverless.containers.yml` file at the project root:

```yaml
name: apollo-graphql

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
    compute:
      type: awsLambda  # Can be switched to awsFargateEcs
```

This file sets the project name, deployment type, and container settings (including routing, environment variables, and compute type).

## Project Structure

A typical project structure is as follows:
```
example-apollo-graphql/
├── serverless.containers.yml      # SCF project configuration file
└── service/
    ├── Dockerfile                 # Multi-stage Dockerfile for Lambda and Fargate
    ├── package.json               # Node.js project configuration and dependencies
    └── src/
        ├── index.js               # Main Apollo Server and Express entrypoint
        └── (additional files)     # GraphQL schema, resolvers, and middleware
```

## Development

SCF provides a development mode that mimics the AWS environment:

```bash
serverless dev
```

This mode supports hot reloading and simulates API Gateway routing, enabling thorough local testing.

## Deployment

Deploy your GraphQL API to AWS using:

```bash
serverless deploy
```

SCF will build the container image, push it to AWS ECR, and provision the necessary AWS resources (ALB, VPC, Lambda or ECS Fargate service).

## Cleanup

For complete infrastructure removal, including shared networking resources:
```bash
serverless remove --force --all
```

## Example Queries

```graphql
# Health Check
query {
  health
}

# Server Info
query {
  info {
    namespace
    containerName
    stage
    computeType
    local
  }
}
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Documentation](https://graphql.org)
- [Express Documentation](https://expressjs.com)