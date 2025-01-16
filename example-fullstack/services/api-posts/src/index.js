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
const port = 8080; // Different port from user-api

// Configure DynamoDB
const client = new DynamoDBClient({
  region: "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.POSTS_TABLE_NAME;

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

// GET /api/posts - Returns all posts
app.get("/api/posts", async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    res.json(response.Items || []);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// GET /api/posts/:id - Returns a specific post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(response.Item);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// POST /api/posts - Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ message: "Title, content, and authorId are required" });
    }

    const newPost = {
      id: Date.now().toString(), // Using timestamp as ID
      title,
      content,
      authorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newPost,
    });

    await docClient.send(command);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// PUT /api/posts/:id - Update a post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
      },
      UpdateExpression:
        "set title = :title, content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title": title,
        ":content": content,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);
    res.json(response.Attributes);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// DELETE /api/posts/:id - Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
      },
    });

    await docClient.send(command);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Posts service is running on http://localhost:${port}`);
});
