const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

config = {
  platform: process.env.SCF_PLATFORM,
  isLocal: process.env.SCF_LOCAL,
  localPort: process.env.SCF_LOCAL_PORT,
  pathPrefix: "/express", // URL prefix, can be modified here
};

/**
 * Midddleware
 */

// Serve static files from the "public" directory
app.use(
  config.pathPrefix,
  express.static(path.join(__dirname, "public"), { redirect: false })
);

app.use((req, res, next) => {
  // Always redirect to HTTPS
  //   if (req.header("x-forwarded-proto") !== "https") {
  //     return res.redirect(`https://${req.header("host")}${req.url}`);
  //   }

  // Enable CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("x-powered-by", "serverless-container-framework");
  next();
});

// Enable error handling of promises
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Routes
 */

// Robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *`);
});

// Options
app.options(`*`, (req, res) => {
  res.status(200).send();
});

// Default
app.get(
  `${config.pathPrefix}*`,
  asyncHandler((req, res) => {
    console.log("hello world");
    res.send(`
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
  `);
  })
);

// Catch-all 404 - for any unmatched paths
app.use((req, res) => {
  res.status(404).send(`
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
  `);
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    message: err.message || "Internal Server Error",
    code: err.code || "internal_error",
    status: err.status,
    // stack: err.stack, Don't include stack trace
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`\nApp initialized`);
});
