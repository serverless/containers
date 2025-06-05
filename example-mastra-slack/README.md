# Mastra Slack AI Agent Example for Serverless Container Framework

📺 **Watch the Tutorial:** [Building AI Agents with Mastra and Serverless Containers](https://youtu.be/7vSVTV-TuIo)

[Serverless Container Framework (SCF)](https://serverless.com/containers/docs) simplifies the development and deployment of containerized applications on AWS Lambda and/or AWS Fargate ECS.

This example demonstrates how to build and deploy an AI-powered Slack bot using [Mastra](https://mastra.ai) and SCF. This is the **default weather agent example** created by Mastra, which you can easily customize by replacing the weather functionality with your own custom tools and prompts for your internal business applications.

## Features

- **AI-Powered Weather Agent:**  
  Intelligent weather assistant that provides accurate weather information for any location (default example - easily customizable).
- **Slack Integration:**  
  Responds to direct messages and mentions in Slack channels using the Slack Bolt framework.
- **Mastra Framework:**  
  Built with Mastra's agent framework for robust AI agent development with memory and tool integration.
- **Weather Tool Integration:**  
  Custom weather tool that fetches real-time weather data for requested locations (replace with your own tools).
- **Persistent Memory:**  
  Maintains conversation context using Mastra's memory system with PostgreSQL storage.
- **Production Ready:**  
  Configured for AWS Fargate ECS deployment to handle concurrent Slack interactions.
- **Easily Customizable:**  
  Replace the weather agent with your own business logic, tools, and prompts.

## Prerequisites

**Docker:**  
Install and start Docker Desktop. ([Get Docker](https://www.docker.com))

**Serverless Framework:**  
Install globally:

```bash
npm i -g serverless
```

**Node.js & npm:**  
Ensure you have Node.js 20.9.0 or higher installed.

**AWS Credentials:**  
Configure your AWS credentials (via environment variables or profiles) for SCF deployments.

**OpenAI API Key:**  
Get an API key from [OpenAI](https://platform.openai.com/api-keys) for the AI agent.

**PostgreSQL Database:**  
Set up a PostgreSQL database for agent memory storage. You can use free or affordable option like [Neon](https://neon.tech).

## Quick Setup

The easiest way to set up your Slack app and get all required credentials is to use the Serverless Framework's initialization command:

```bash
serverless init
```

This command will:

- Guide you through creating a new Slack app
- Set up the necessary permissions and event subscriptions
- Generate the required tokens and secrets
- Provide the required environment variables

## Configuration

At the project root, the `serverless.containers.yml` file defines the SCF configuration:

```yaml
name: mastra-slack

deployment:
  type: "aws@1.0"

containers:
  agent:
    src: ./
    compute:
      type: awsFargateEcs
      awsFargateEcs:
        cpu: 1024
        memory: 2048
    routing:
      pathPattern: "/*"
      pathHealthCheck: "/"
    environment:
      OPENAI_API_KEY: ${env:OPENAI_API_KEY}
      PORT: 8080
      SLACK_APP_NAME: ${env:SLACK_APP_NAME}
      SLACK_SIGNING_SECRET: ${env:SLACK_SIGNING_SECRET}
      SLACK_BOT_TOKEN: ${env:SLACK_BOT_TOKEN}
      SLACK_APP_TOKEN: ${env:SLACK_APP_TOKEN}
      DB_URL: ${env:DB_URL}
    integrations:
      slack:
        type: slack
        name: ${env:SLACK_APP_NAME}
```

## Environment Variables

Copy `.env-example` to `.env` and fill in the required values:

```bash
cp .env-example .env
```

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `SLACK_APP_NAME`: Name of your Slack app
- `SLACK_SIGNING_SECRET`: Slack app signing secret
- `SLACK_BOT_TOKEN`: Slack bot token (starts with `xoxb-`)
- `SLACK_APP_TOKEN`: Slack app token for Socket Mode (starts with `xapp-`)
- `DB_URL`: PostgreSQL connection string (e.g., from Neon, Supabase, or other providers)

## Project Structure

```
example-mastra-slack/
├── serverless.containers.yml      # SCF configuration file
├── package.json                   # Project dependencies
├── .env-example                   # Environment variables template
└── src/
    └── mastra/
        ├── index.ts              # Main Mastra application and Slack integration
        ├── store.ts              # Storage configuration for agent memory
        ├── agents/
        │   └── weather-agent.ts  # Weather AI agent implementation (customize this!)
        └── tools/
            └── weather-tool.ts   # Weather data fetching tool (replace with your tools!)
```

## Customization

This example uses the default Mastra weather agent, but you can easily customize it for your business needs:

1. **Replace the Agent**: Modify `src/mastra/agents/weather-agent.ts` with your own agent logic and instructions
2. **Add Custom Tools**: Replace or add to `src/mastra/tools/` with tools specific to your business (database queries, API calls, etc.)
3. **Update Instructions**: Change the agent's system prompt to match your use case
4. **Add More Agents**: Create multiple specialized agents for different functions

Example customizations:

- Customer support agent with access to your CRM
- Internal IT helpdesk with system monitoring tools
- Sales assistant with product catalog integration
- HR assistant with employee directory access

## Development

For local development, use Serverless Container Framework's development mode:

```bash
serverless dev
```

This will start the Mastra development server with hot reloading. In local development mode, the agent uses Slack's Socket Mode for real-time communication.

You can also run the Mastra development server directly:

```bash
npm run dev
```

## Deployment

Deploy your Mastra Slack AI agent to AWS by running:

```bash
serverless deploy
```

SCF builds the container image and provisions the necessary AWS resources. After deployment, update your Slack app's Event Subscriptions URL to point to the deployed endpoint.

## Usage

Once deployed and configured:

1. **Direct Messages:** Send a direct message to your bot asking about weather
2. **Channel Mentions:** Mention your bot in any channel with weather questions

Example interactions (default weather agent):

- "What's the weather in New York?"
- "How's the weather in Tokyo today?"
- "Tell me about the weather conditions in London"

The agent will respond with current weather information including temperature, humidity, wind conditions, and precipitation details.

**Note:** This is just the default example. Replace the weather functionality with your own business logic!

## Cleanup

To remove the deployed AWS resources, run:

```bash
serverless remove --force --all
```

## Additional Resources

- [Serverless Container Framework Documentation](https://serverless.com/containers/docs)
- [Mastra Documentation](https://mastra.ai/docs)
- [Slack Bolt Framework](https://slack.dev/bolt-js/concepts)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [AWS Fargate Documentation](https://aws.amazon.com/fargate)
- [Neon PostgreSQL](https://neon.tech) - Free PostgreSQL database
- [Supabase](https://supabase.com) - Free PostgreSQL with additional features
