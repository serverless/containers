import express, { json } from "express";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const app = express();
const port = 8080;

// Configure DynamoDB
const client = new DynamoDBClient({
  region: "us-east-1", // replace with your region
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USER_TABLE_NAME;

// CORS and JSON middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(json());

// GET /api/users - Returns all users
app.get("/api/users", async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    res.json(response.Items || []);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /api/users/:id - Returns a specific user
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id: userId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(response.Item);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// POST /api/users - Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Get the highest ID (we should use UUID in production)
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: "id",
    });

    const scanResponse = await docClient.send(scanCommand);
    const newId =
      Math.max(0, ...(scanResponse.Items || []).map((item) => item.id)) + 1;

    const newUser = {
      id: newId,
      name,
      email,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newUser,
    });

    await docClient.send(command);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// PUT /api/users/:id - Update a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        id: userId,
      },
      UpdateExpression: "set #name = :name, #email = :email",
      ExpressionAttributeNames: {
        "#name": "name",
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":email": email,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);
    res.json(response.Attributes);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE /api/users/:id - Delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id: userId,
      },
    });

    await docClient.send(command);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
