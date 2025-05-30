---
title: Serverless Container Framework - Configuration Guide
short_title: Configuration Guide
description: >-
  Complete guide to Serverless Container Framework's YAML configuration. Learn
  how to set up  containers, routing, compute options, and environment variables
  for AWS Lambda and AWS ECS Fargate  deployments.
keywords:
  - Serverless Container Framework
  - Serverless Container Framework YAML
  - Serverless Container Framework Configuration
  - AWS Lambda Configuration
  - AWS ECS Configuration
  - AWS Fargate Configuration
  - Serverless YAML
  - Container Configuration
  - AWS Lambda Config
  - Fargate Configuration
  - Environment Variables
  - Container Routing
  - AWS IAM Setup
  - Development Config
  - Infrastructure Config
  - Docker Configuration
  - Serverless Framework
  - Container Management
  - AWS Container Setup
  - Deployment Configuration
---

# Configuration

The `serverless.containers.yml` file is used to configure your API and the containers that make up your API.

## Stages, regions, and more

Like in Serverless Framework, SCF has support for deploying into different stages (i.e. environments) out-of-the-box. This allows you to create separate resources for difference stages.

As of now, there is no `stage` property in SCF. Instead, use the CLI option to specify the stage `--stage <stage-name>`. You can also use the stage environment variable `SERVERLESS_STAGE=<stage-name>`. By default, SCF will use the stage `dev`. Please note that the `name` and the `stage` will be used as part of the names of infrastructure resources created by SCF. Due to _strict_ character limitations in names on behalf of AWS and other cloud providers, you will want to keep both the `name` and the `stage` short (<12 characters each).

When deploying to AWS, you can specify a region to deploy resources into. As of now, there is no `region` property in SCF. Please use the following AWS-standard conventions for specifying regions. Set the environment variable `AWS_REGION=us-east-2` to the desired region. Or set the region within your AWS profile on your machine. `region = us-east-2`. `us-east-1` is the default region for SCF.

## Basic Configuration

The following represents the basic structure of a `serverless.containers.yml` file.

```yaml
name: my-app # Required: Namespace for the project. Can only contain letters, numbers, hyphens, and underscores. Keep it short as resources created by SCF will include this.

deployment:
  type: awsApi@1.0 # Required: The deployment type. SCF deploys more than containers, it also deploy infrastructure offer instant use-cases for those containers. The "awsApi" is used to deploy AWS Application Load Balancer and other networking components, to offer a production-ready API, instantly. You will soon be able to reference existing infrastructure, rather than creating new resources within this property.

containers:
  my-container: # Required: Container name. Must be unique within the namespace. List one or many containers here.
```

## Container Configuration

Within the `containers` section, you can configure one or many containers. Each container can have its own unique configuration.

```yaml
containers:
  my-container:
    src: ./path/to/container # Required: Path to the container source code.
    compute: # Required: Compute configuration.
    build: # Optional: Build configuration.
    environment: # Optional: Environment variables to pass to the container. Can be objects but will be stringified in containers.
    routing: # Required: Routing configuration.
    dev: # Optional: Development mode configuration.
```

### Container Build Configuration

The `build` configuration is used to configure the build for the container. You can specify build-time arguments, a Dockerfile as a string, or additional build options. The additional build options allow you to add extra Docker flags (such as `--target awsLambda`) to the build command without altering other settings.

```yaml
build:
  args: # Optional: Arguments to pass to the build, as a map of key-value pairs. This is useful for passing in build arguments to the Dockerfile, like ssh keys to fetch private dependencies, etc.
    key: value # Example: ARG key=value
  dockerFileString: # Optional: The content of a Dockerfile as a string, to use for the container. Please note, this is not recommended for public use, and this is not where you specify the path to your Dockerfile. No config is required for specifying the Dockerfile path, simply put your Dockerfile in the root of the `src` directory.
  options: # Optional: Additional Docker build flags (e.g. "--target production"). Accepts either a space-delimited string or an array of strings.
    --target=awsLambda
```

If you are building custom Dockerfiles, using Target Builds are useful if you have multiple targets in your Dockerfile, one for AWS Lambda and one for AWS Fargate ECS.

You can optionally specify a Dockerfile as a string in the `dockerFileString` configuration. We don't recommend this approach, and recommend you use a Dockerfile in the container source code instead. This is useful only for other tools that are powered by SCF.

### Container Compute Configuration

The `compute` configuration is used to configure which compute service will be used for the container, and the configuration for that compute service.

Currently, the only compute services supported are AWS Lambda (`awsLambda`) and AWS Fargate ECS (`awsFargateEcs`).

#### AWS Lambda Configuration

```yaml
compute:
  type: awsLambda # Required: The compute type.
  awsLambda: # Optional: AWS Lambda specific compute configuration.
    memory: 1024 # Optional: Memory allocation in MB. Any value between 128MB and 10,240MB. Default is 1024.
    vpc: false # Optional: Enable VPC support for the Lambda function. Default is false.
```

#### AWS Fargate ECS Configuration

```yaml
compute:
  type: awsFargateEcs # Required: The compute type.
  awsFargateEcs: # Optional: AWS Fargate ECS specific compute configuration.
    cpu: 256 # CPU units (256-16384). Valid values: 256, 512, 1024, 2048, 4096, 8192, 16384. Default is 256.
    memory: 512 # Memory in MB (512-122880). Must be compatible with selected CPU units. Default is 512.
    scale: # Optional: Scaling configuration. See below for more information.
```

##### AWS Fargate ECS Scaling

Currently, SCF supports a variety of scaling policies that are available for AWS ECS Fargate, which offer various fixed and autoscaling options. By default, every AWS ECS Fargate Task is set to only have 1 Task. In AWS ECS Fargate terms, it sets a `desired` of `1`.

To change that, the `scale` property is available at `<container>.compute.awsFargateEcs.scale` which is an array that accepts the scaling policies you wish to assign to your container on AWS ECS Fargate.

###### Desired Count (Fixed Scaling)

If you wish to set a fixed amount of Tasks to run (i.e. not autoscale), use this option. Please note, if you use this with an autoscaling policy (e.g. Target Tracking), AWS ECS Fargate will not acknowledge it and your Task count will change per the autoscaling policy's direction.

| Property  | Description                       | Required | Default |
| --------- | --------------------------------- | -------- | ------- |
| `type`    | Can only be `desired`             | Yes      |         |
| `desired` | The desired count of the service. | Yes      |         |

###### Target Tracking CPU & Memory (Autoscaling)

Target Tracking policies are one way to autoscale on AWS ECS Fargate. They allow autoscaling based on CPU and Memory utilization thresholds (e.g. if CPU utilization exceeds 70%, increase AWS ECS Fargate Tasks). Also available are Step Scaling options, which are ideal if you understand your traffic and you wish to highly optimize for cost. That said, setting Target Tracking policies are by far the most popular way to autoscale on AWS ECS Fargate (80% of AWS ECS Fargate use this method).

You are allowed to have a maximum of 3 Target Tracking policies, one for each `cpu`, `memory`, or `albRequestsPerTarget` as the targets. Note that Target Tracking scaling cannot be combined with Step Scaling in the same service.

If you are in a high traffic scenario, and you are pushing out a new deployment, and you do not have a desired setting but you do have autoscaling policies applied, note that SCF will automatically look at the current running count of Tasks before the deployment happens and set that as the desired count as it performs the deployment, to ensure you do not suffer a loss or overage of Tasks immediately after the changes roll out, affecting the availability of your Service.

**IMPORTANT:** We highly recommend setting a `max` scaling policy alongside this, as it could prevent you from massive AWS bills. Learn how to configure `max` in this documentation.

| Property           | Description                                                                                                                                                  | Required | Default |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------- |
| `type`             | Can only be `target`                                                                                                                                         | Yes      |         |
| `target`           | The target to scale on. Can be `cpu`, `memory`, or `albRequestsPerTarget`. Both of these target the "average" Cloudwatch metric, not the minimum or maximum. | Yes      |         |
| `value`            | The threshold to scale on. This is a whole number percentage between 1 and 100.                                                                              | No       | 70      |
| `scaleIn`          | Whether to scale in when the threshold is no longer met.                                                                                                     | No       | true    |
| `scaleInCooldown`  | The cooldown period to scale in. This is a whole number between 1 and 100.                                                                                   | No       |         |
| `scaleOutCooldown` | The cooldown period to scale out. This is a whole number between 1 and 100.                                                                                  | No       |         |

###### Step Scaling (Autoscaling)

Step Scaling policies provide more granular control over scaling actions based on metric thresholds. Unlike Target Tracking, which adjusts capacity to maintain a specific metric value, Step Scaling allows you to define different scaling actions for different metric value ranges. This is particularly useful for workloads with predictable patterns or when you need precise control over scaling behavior.

**Important Notes:**

- Step Scaling cannot be combined with Target Tracking scaling in the same service
- Step adjustments must be in ascending order with no overlap
- You must set min/max scaling limits when using Step Scaling

| Property                | Description                                                                                                                                                                       | Required | Default |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `adjustmentType`        | How the scaling adjustment should be applied. Must be one of: `ChangeInCapacity`, `PercentChangeInCapacity`, or `ExactCapacity`.                                                  | Yes      |         |
| `stepAdjustments`       | Array of step adjustments defining scaling actions. Each step adjustment specifies a scaling action based on metric value ranges.                                                 | Yes      |         |
| `cooldown`              | Cooldown period in seconds between scaling activities.                                                                                                                            | No       | 60      |
| `metricAggregationType` | How the metric data points should be aggregated. Must be one of: `Average`, `Minimum`, or `Maximum`.                                                                              | No       | Average |
| `metricName`            | The name of the metric to use for scaling (e.g., `CPUUtilization`).                                                                                                               | Yes      |         |
| `namespace`             | The namespace of the metric (e.g., `AWS/ECS`).                                                                                                                                    | Yes      |         |
| `dimensions`            | The dimensions of the metric as an array of name-value pairs.                                                                                                                     | No       |         |
| `threshold`             | The threshold value that triggers the scaling action.                                                                                                                             | Yes      |         |
| `comparisonOperator`    | The comparison operator to use with the threshold. Must be one of: `GreaterThanOrEqualToThreshold`, `GreaterThanThreshold`, `LessThanThreshold`, or `LessThanOrEqualToThreshold`. | Yes      |         |

**Step Adjustment Properties:**

Each step adjustment in the `stepAdjustments` array defines a scaling action for a specific metric value range:

| Property                   | Description                                               | Required |
| -------------------------- | --------------------------------------------------------- | -------- |
| `metricIntervalLowerBound` | Lower bound for the metric interval.                      | No       |
| `metricIntervalUpperBound` | Upper bound for the metric interval.                      | No       |
| `scalingAdjustment`        | The amount to scale by when this step adjustment applies. | Yes      |

At least one of `metricIntervalLowerBound` or `metricIntervalUpperBound` must be specified for each step adjustment. The final step adjustment typically only specifies a lower bound to capture all values above that threshold.

###### Minimum Count (Autoscaling)

If you have an autoscaling policy enabled, like Target Tracking or Step Scaling, use this to determine the lowest Task count you want your AWS ECS Fargate to scale down to. In other words, this sets a scaling floor. If you do not have an autoscaling policy enabled, this will have no effect.

| Property | Description                       | Required | Default |
| -------- | --------------------------------- | -------- | ------- |
| `type`   | Can only be `min`                 | Yes      | `min`   |
| `min`    | The minimum count of the service. | Yes      |         |

###### Maximum Count (Autoscaling)

If you have an autoscaling policy enabled, like Target Tracking or Step Scaling, use this to determine the highest Task count you want your AWS ECS Fargate to scale up to. In other words, this sets a scaling ceiling. If you do not have an autoscaling policy enabled, this will have no effect.

**IMPORTANT:** This is required if you set any scaling policies, otherwise you will have unbound compute scaling.

| Property | Description                       | Required | Default |
| -------- | --------------------------------- | -------- | ------- |
| `type`   | Can only be `max`                 | Yes      | `max`   |
| `max`    | The maximum count of the service. | Yes      |         |

**Examples for AWS Fargate ECS**

Example using desired count scaling policy:

```yaml
compute:
  type: awsFargateEcs
  awsFargateEcs:
    scale:
      - type: desired
        desired: 5
```

Example using a Target Tracking autoscaling policy based on CPU utilization with min/max scaling:

```yaml
compute:
  type: awsFargateEcs
  awsFargateEcs:
    scale:
      - type: target
        target: cpu
        value: 70
      - type: min
        min: 1
      - type: max
        max: 10
```

Example using two Target Tracking autoscaling policies targetting both CPU and Memory utilization with min/max scaling:

```yaml
compute:
  type: awsFargateEcs
  awsFargateEcs:
    scale:
      - type: target
        target: cpu
        value: 70
      - type: target
        target: memory
      - type: min
        min: 1
      - type: max
        max: 10
```

Example using Step Scaling policy with multiple step adjustments based on CPU utilization:

```yaml
compute:
  type: awsFargateEcs
  awsFargateEcs:
    scale:
      - type: step
        adjustmentType: ChangeInCapacity
        stepAdjustments:
          - metricIntervalLowerBound: 0
            metricIntervalUpperBound: 20
            scalingAdjustment: 1
          - metricIntervalLowerBound: 20
            metricIntervalUpperBound: 40
            scalingAdjustment: 2
          - metricIntervalLowerBound: 40
            scalingAdjustment: 3
        metricName: CPUUtilization
        namespace: AWS/ECS
        threshold: 75
        comparisonOperator: GreaterThanThreshold
        metricAggregationType: Average
        cooldown: 60
      - type: min
        min: 1
      - type: max
        max: 10
```

In this example, when CPU utilization exceeds 75%:

- If the excess is between 0% and 20% (75%-95%), add 1 task
- If the excess is between 20% and 40% (95%-115%), add 2 tasks
- If the excess is above 40% (>115%), add 3 tasks

Example using Step Scaling with custom CloudWatch metric:

```yaml
compute:
  type: awsFargateEcs
  awsFargateEcs:
    scale:
      - type: step
        adjustmentType: PercentChangeInCapacity
        stepAdjustments:
          - metricIntervalLowerBound: 0
            scalingAdjustment: 25
        metricName: QueueDepth
        namespace: MyApplication
        dimensions:
          - name: QueueName
            value: MainQueue
        threshold: 100
        comparisonOperator: GreaterThanThreshold
      - type: min
        min: 2
      - type: max
        max: 20
```

This example increases capacity by 25% when the custom metric "QueueDepth" exceeds 100.

### Container Routing Configuration

The `routing` configuration is used to configure the routing for the container with AWS Application Load Balancer.

Here, we configure the custom domain, the path pattern, and the health check path.

```yaml
routing:
  domain: example.com # Optional, Recommended: Custom domain. Different containers can use different custom domains. For AWS, the custom domain does not have to exist in Route 53, but must have a hosted zone in Route 53, allowing you to use domains from different registrars (e.g., Cloudflare, Google Domains, etc.). That Route 53 hosted zone will be automatically found and used. Do not include "http://" or "https://". For AWS, routing is handled at the AWS Application Load Balancer (ALB) level using host-based rules, meaning subdomains (e.g., "api.example.com") can direct traffic to different target groups.
  pathPattern: /api/* # Required: URL path pattern to route requests to this container. Supports: exact matches (e.g., "/images/logo.png"), prefix matches (e.g., "/api/users/*" matches "/api/users/123"), wildcard (*) for multi-level matches (e.g., "/assets/*/images/*" matches "/assets/v1/images/logo.png"), question mark (?) for single-character matches (e.g., "/profile/202?" matches "/profile/2021"), and is case-sensitive ("/api" is not the same as "/API"). Query parameters are not evaluated.
  pathHealthCheck: /health # Optional, Recommended: Health check path. Deployments to AWS Fargate ECS will wait for the health check to pass before marking the deployment as successful. If you do not specify a health check path, the base path of your pathPattern will be used (e.g. "/api/*" means "/api" will be checked). Ensure it returns a 200 status code, or your deployment might fail.
```

### Container Environment Configuration

The `environment` configuration is used to pass environment variables to the container. You can use Serverless Framework Variables to load environment variables from a .env file, AWS Secrets Manager, or AWS Systems Manager Parameter Store, HashiCorp Vault, HashiCorp Terraform state, and more.

Check out the documentation for [Serverless Framework Variables](https://www.serverless.com/framework/docs/guides/variables) for more information.

```yaml
environment:
  SERVICE_NAME: my-container # Example
  DATABASE_ARN: ${env:DATABASE_ARN} # Example, using Serverless Framework Variables to resolve a value from AWS Secrets Manager.
  DATABASE_URL: ${aws:ssm:/path/to/param} # Example, using Serverless Framework Variables to resolve a value from AWS Systems Manager Parameter Store.
  DATABASE_PASSWORD: ${vault:secret/data/mongo/credentials.password} # Example, using Serverless Framework Variables to resolve a value from HashiCorp Vault.
  DATABASE_HOST: ${terraform:outputs:users_table_arn} # Example, using Serverless Framework Variables to resolve a value from HashiCorp Terraform state.
  DATABASE_PORT: ${aws:s3:myBucket/myKey} # Example, referencing a value from an S3 bucket.
```

### Container Development Mode Configuration

The `dev` configuration is used to configure the container for development mode. Currently supports nodejs apps, with python support planned for the future.

```yaml
dev:
  hooks: # Optional: Commands to run when specific dev mode events occur
    onreload: string # Optional: Hook command to run when container reloads. Must be a valid shell command that works in the system default shell.
  watchPath: string # Optional: Custom path to watch for file changes
  watchExtensions: # Optional: File extensions to watch for changes. Array of strings.
    - '.js'
    - '.json'
  excludeDirectories: # Optional: Directories to exclude from watching. Array of strings.
    - 'node_modules'
    - 'dist'
```

### AWS IAM Configuration

The `awsIam` configuration is used to create/update an AWS IAM role and its permissions policy specific to the container, allowing the container to access other services on Amazon Web Services.

This makes it easy to add the necessary permissions to the container without having to manage IAM policies elsewhere.

No other containers will share this AWS IAM role, so scope it only to the permissions needed for that container.

```yaml
compute:
  awsIam:
    customPolicy: # Optional: Custom IAM policy for the container. Accepts standard AWS IAM policy syntax in YAML format.
      Version: '2012-10-17' # IAM policy version, typically "2012-10-17"
      Statement:
        - Effect: Allow # Whether to Allow or Deny the specified actions
          Action: # AWS IAM actions to allow or deny
            - dynamodb:GetItem
          Resource: # AWS resource ARNs the policy applies to
            - '*'
```

You can also bring your own AWS IAM role, and SCF will use that role for the container, if you set `roleArn` you cannot set `customPolicy` then.

```yaml
compute:
  awsIam:
    roleArn: '<ARN>' # ARN of the IAM role to use for the container's permissions for accessing AWS Services
```

If you specify an AWS IAM role managed elsewhere (not created by SCF) you have to ensure you have the required trust policy to allow AWS Lambda or ECS to assume the role.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Container Dockerfile Configuration

SCF will automatically detect the Dockerfile in the container source code and use it to build the container.

## Complete Example

The following is a complete example of a `serverless.containers.yml` file, for a classic full-stack application.

```yaml
name: acmeinc

deployment:
  type: awsApi@1.0
  # ... Here is where you can add existing resources (AWS ALB, AWS VPC, AWS WAF)

containers:
  # Web (Frontend)
  service-web:
    src: ./web
    routing:
      domain: acmeinc.com
      pathPattern: /*
    compute:
      type: awsLambda
  # API (Backend)
  service-api:
    src: ./api
    routing:
      domain: api.acmeinc.com
      pathPattern: /api/*
      pathHealthCheck: /health
    compute:
      type: awsFargateEcs
      awsFargateEcs:
        memory: 4096
        cpu: 1024
      environment:
        HELLO: world
      awsIam:
        customPolicy:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - dynamodb:GetItem
              Resource:
                - '*'
```

## Deployment Types

In addition to containers, SCF deploys other infrastructure to offer entire archictectures for use-cases using your containers, such as an API. This is called the Deployment Type and is set under the `deployment.type` property.

The `deployment.type` property is where you specify the architecture you seek to deploy, as well as specific configuration for infrastrucutre outside of the infrastructure used to run your containers, such as AWS Applciatin Load Blanacer, AWS VPCs, etc.

### awsApi

This Deployment Type creates an API with your containers using AWS Application Load Balancer.

You can control configuration for resources outside of the containers here, including bringing existing resources into your architecture, like VPC, Subnets, Security Groups, and IAM roles. You are also able to bring an AWS WAF with you to associate with the SCF ALB that is created in this deployment type.

```yaml
deployment:
  type: awsApi@1.0
  awsVpc: # Optional, but if set all values below must be set
    id: vpc-12345678 # Required: VPC ID
    publicSubnets: # Required: Public Subnet IDs, what will be attached to the ALB. At least two must be set
      - subnet-12345678
      - subnet-23456789
    privateSubnets: # Required: Private Subnet IDs, what will be attached to the ECS Fargate Tasks. At least two must be set
      - subnet-12345678
      - subnet-23456789
    s2sSecurityGroupId: sg-12345678 # Required: Security Group ID that will be attached to ECS Fargate Tasks and the ALB to allow them to communicate with each other
    loadBalancerSecurityGroupId: sg-12345678 # Required: Security Group ID that will be attached to the ALB to allow traffic from the internet
  awsAlb:
    wafAclArn: '<ARN>' # Optional: ARN of the WAF ACL to associate with the ALB
  awsFargateEcs:
    executionRoleArn: '<ARN>' # Optional: ARN of the IAM role to use for ECS Task Execution
  awsIam:
    roleArn: '<ARN>' # Optional: ARN of the IAM role to use for the container's permissions for accessing AWS Services
```

SCF will validate these resources to ensur they exist and they are usable for SCF before deployment, but SCF will never make changes to them. For example, if you specify a service-to-service security group that does not allow communication to itself, SCF will not deploy until you fix that.

### Bring Your Own IAM Role Permissions and Trust Policies

If you bring your own AWS IAM role, the trust policy on the role must allow Lambda and ECS to assume the role. For example,

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

If you bring your own IAM role for Fargate Task execution, the trust policy on the role must allow ECS to assume the role, and the IAM policy must allow the following services,

#### Trust Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

