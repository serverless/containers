# SCF Fullstack App

This is a demo application built with the Serverless Container Framework (SCF). It utilizes Serverless Compose in order to deploy a Cloudformation stack for shared resources, and SCF to deploy two APIs and a UI.

## Prerequisites

- Docker must be installed. **Note:** Docker Desktop for Linux is not supported.
- [Serverless Framework](https://serverless.com/framework/docs/getting-started/) (If you are testing, you should checkout the `container-framework` branch of `framework-core`)
- AWS Credentials for the account you want to deploy to.

## Project Structure

```
.
├── scf/
│   ├── posts-api/
│   ├── user-api/
│   ├── ui/
├── infra/
│   ├── template.yaml
├── serverless.containers.yml
```
