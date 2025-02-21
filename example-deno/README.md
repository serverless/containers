# Deno V2 Example for Serverless Container Framework

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) is a tool that simplifies the development and deployment of containerized applications to AWS Lambda and/or AWS Fargate ECS.

This example demonstrates the development and deployment of a simple, performant web application built with Deno V2, the Oak framework, and the Serverless Container Framework.

## Features

- **Deno V2 Support:** Utilizes the official Deno V2 image to run your Deno application.
- **Oak Framework:** Utilizes the [Oak framework](https://deno.land/x/oak), a middleware framework for handling HTTP requests.
- **TypeScript:** Uses TypeScript for the application codebase.
- **Compute Flexibility:** Configure the container's compute type to run either as an AWS Lambda function (`awsLambda`) or on AWS Fargate ECS (`awsFargateEcs`). A multi-stage Dockerfile is provided to support these configurations.
- **Local Development:** SCF includes a rich development mode that emulates AWS ALB routing, AWS Lambda, and AWS Fargate ECS locally, allowing you to develop and test your Deno application with near-production parity.

## Prerequisites

**Docker:** Install and start Docker Desktop, as it is required. Get it [here](https://www.docker.com).

**Serverless Framework:** Serverless Container Framework is a feature of the Serverless Framework.

```
npm i -g serverless
```

**AWS Credentials:** Properly configure your AWS credentials (via environment variables or AWS profiles) to allow SCF to provision and update AWS resources. These are required to use the Serverless Container Framework.

## Configuration

At the root of the example, a `serverless.containers.yml` file defines the project configuration:

```yaml
name: deno

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
      type: awsLambda # Can be switched to awsFargateEcs
    build:
      options:
        - --target=awsLambda # Ensure you match the compute type set above. Sets the target build stage for the Dockerfile.
```

This file specifies:
- **Namespace:** The project name is `deno`, which is used as a prefix to namespace resources in your AWS account.
- **Deployment Type:** Uses the AWS API deployment type to configure networking (ALB, VPC, etc.).
- **Container Details:**
  - The source code is in the `./service` directory.
  - Routing rules specify a catch-all route (`/*`) with a defined health check endpoint (`/health`).
  - An environment variable (`HELLO`) is provided.
  - The default compute type is set to `awsLambda` but can be switched to `awsFargateEcs` as needed.

Learn more about Configuration in the [Serverless Container Framework Documentation](https://serverless.com/containers/docs/configuration).

```
example-deno/
├── serverless.containers.yml      # SCF project configuration file
└── service/
    ├── Dockerfile                 # Multi-stage Dockerfile for AWS Lambda and Fargate builds
    ├── deno.json                  # Deno configuration and task definitions
    ├── deno.lock                  # Deno lock file
    └── src/
        ├── index.ts               # Main application entrypoint (uses Oak and oakCors)
        └── public/
            └── css/
                └── styles.css     # Static assets (CSS, images, etc.)
```

## Development

SCF includes a rich development mode that emulates AWS ALB routing, AWS Lambda, and AWS Fargate ECS locally. This mode allows you to test routing, static asset delivery, and health check endpoints while running your container with Deno, which proxies requests on port `8080`.

Run the following command to start local development mode:

```bash
serverless dev
```

This command watches for changes and rebuilds the container as needed.

Learn more about Development in the [Serverless Container Framework Documentation](https://serverless.com/containers/docs/development).

## Deployment

To deploy this example with SCF, open your terminal in the `example-deno` directory.

Execute the following command to deploy your container to AWS:

```bash
serverless deploy
```

This command builds the Deno container image using the provided Dockerfile and provisions AWS resources (ALB, VPC, Lambda function, or ECS Fargate service).

If you switch compute types, ensure that you set the build `--target` option to the corresponding compute type, since the Dockerfile declares multiple build configurations.

Once deployed, SCF will output the URLs and endpoints (such as the ALB endpoint) for your application.

Access the application via the provided URL to see your Deno app live.

To remove the deployed containers, run:

```bash
serverless remove
```

To remove all AWS resources, including shared infrastructure, use:

```bash
serverless remove --force --all
```

Learn more about Deployment in the [Serverless Container Framework Documentation](https://serverless.com/containers/docs/deployment).

## Additional Resources

* [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
* [Official Deno Website](https://deno.land/)
