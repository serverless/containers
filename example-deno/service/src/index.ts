import { Application, Router } from "oak";
import { oakCors } from "cors";

const app = new Application();
const router = new Router();

/**
 * Middleware to enable CORS.
 */
app.use(oakCors());

/**
 * Middleware to add custom headers.
 */
app.use(async (ctx, next) => {
  ctx.response.headers.set("x-powered-by", "serverless-container-framework");
  await next();
});

// Define routes using router

/**
 * Health check endpoint.
 */
router.get("/health", (ctx) => {
  ctx.response.body = "OK";
});

/**
 * Robots.txt endpoint.
 */
router.get("/robots.txt", (ctx) => {
  ctx.response.type = "text/plain";
  ctx.response.body = "User-agent: *";
});

/**
 * Default route endpoint.
 *
 * This route returns the main HTML page that matches the Express app's content.
 */
router.get("/", (ctx) => {
  ctx.response.type = "text/html";
  ctx.response.body = `
    <html>
      <head>
        <title>Serverless Container Framework</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/css/styles.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
      </head>
      <body>
        <div class="container">
          <img src="/images/logo.png" alt="Logo" class="logo">
          <div class="info">Namespace: ${Deno.env.get("SERVERLESS_NAMESPACE")}</div>
          <div class="info">Container Name: ${Deno.env.get("SERVERLESS_CONTAINER_NAME")}</div>
          <div class="info">Stage: ${Deno.env.get("SERVERLESS_STAGE")}</div>
          <div class="info">Compute Type: ${Deno.env.get("SERVERLESS_COMPUTE_TYPE")}</div>
          <div class="info">Local: ${Deno.env.get("SERVERLESS_LOCAL")}</div>
        </div>
      </body>
    </html>
  `;
});

// Register router middlewares
app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Middleware to serve static files.
 */
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/src/public`,
      index: "index.html"
    });
  } catch {
    await next();
  }
});

/**
 * 404 Fallback handler.
 *
 * If no route (or static file) matches the request, this middleware returns a 404 page
 * that matches the Express app's HTML content.
 */
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.type = "text/html";
  ctx.response.body = `
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/css/styles.css">
        <link rel="icon" type="image/png" href="/images/favicon.png">
      </head>
      <body>
        <div class="container">
          <h1>404 - Page Not Found</h1>
          <a href="/">Return to Home</a>
        </div>
      </body>
    </html>
  `;
});

const port = 8080;
console.log(`Server running at http://localhost:${port}`);
await app.listen({ port });
