import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";

const app = new Hono();

const config = {
  platform: process.env.SCF_PLATFORM,
  isLocal: process.env.SCF_LOCAL,
  localPort: process.env.SCF_LOCAL_PORT,
  pathPrefix: "/hono", // URL prefix, can be modified here
};

/**
 * Middleware
 */

// Middleware to set headers
app.use("*", async (c, next) => {
  // Enable CORS
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "*");
  c.header("Access-Control-Allow-Headers", "*");
  c.header("x-powered-by", "serverless-container-framework");
  await next();
});

// Serve static files from the "public" directory
app.use(
  "/hono/*",
  serveStatic({
    root: "src/public",
    rewriteRequestPath: (path) => path.replace(/^\/hono/, "/"),
  })
);

/**
 * Routes
 */

// Robots.txt
app.get("/robots.txt", (c) => c.text("User-agent: *"));

// Options
app.options("*", (c) => c.status(200).body(""));

// Default Route
app.get(`${config.pathPrefix}`, (c) =>
  c.html(`
    <html>
      <head>
        <title>Serverless Container Framework</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="${
          config.pathPrefix
        }/css/styles.css">
        <link rel="icon" type="image/png" href="${
          config.pathPrefix
        }/images/favicon.png">
      </head>
      <body>
        <div class="container">
          <img src="${
            config.pathPrefix
          }/images/logo.png" alt="Logo" class="logo">
          <div class="info">Compute Type: ${config.platform}</div>
          <div class="info">Local: ${config.isLocal ? true : false}</div>
        </div>
      </body>
    </html>
  `)
);

// Catch-all 404 Handler
app.notFound((c) =>
  c.html(
    `
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="${config.pathPrefix}/css/styles.css">
        <link rel="icon" type="image/png" href="${config.pathPrefix}/images/favicon.png">
      </head>
      <body>
        <div class="container">
          <h1>404 - Page Not Found</h1>
          <a href="${config.pathPrefix}">Return to Home</a>
        </div>
      </body>
    </html>
  `,
    404
  )
);

/**
 * Error Handler
 */
app.onError((err, c) => {
  console.error(err);
  const status = err.status || 500;
  return c.json(
    {
      error: err.message || "Internal Server Error",
      message: err.message || "Internal Server Error",
      code: err.code || "internal_error",
      status: status,
      // stack: err.stack, // Don't include stack trace
    },
    status
  );
});

serve({ fetch: app.fetch, port: process.env.PORT || 8080 });
