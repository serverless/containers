import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';

// Define GraphQL schema
const typeDefs = `#graphql
  type ServerInfo {
    namespace: String
    containerName: String
    stage: String
    computeType: String
    local: String
  }

  type Query {
    health: String!
    info: ServerInfo!
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    health: () => 'OK',
    info: () => ({
      namespace: process.env.SERVERLESS_NAMESPACE,
      containerName: process.env.SERVERLESS_CONTAINER_NAME,
      stage: process.env.SERVERLESS_STAGE,
      computeType: process.env.SERVERLESS_COMPUTE_TYPE,
      local: process.env.SERVERLESS_LOCAL
    })
  }
};

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint (non-GraphQL)
app.get('/health', (req, res) => {
  res.send('OK');
});

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start server
await server.start();

// Apply middleware
app.use('/', expressMiddleware(server));

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
