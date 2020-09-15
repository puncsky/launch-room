const { config } = require("dotenv");

config();

module.exports = {
  project: "web-onefx-boilerplate",
  server: {
    routePrefix: "",
    port: process.env.PORT || 5000,
    proxy: false,
    staticDir: "./dist",
    delayInitMiddleware: false,
    cookie: {
      secrets: ["insecure plain text", "insecure secret here"],
    },
    noSecurityHeadersRoutes: {
      "/diagnostic": true,
      "/api-gateway/": true,
      "/api/": true,
      "/events/": true,
      "/sdk/": true,
    },
    noCsrfRoutes: {
      "/diagnostic": true,
      "/api-gateway/": true,
      "/api/": true,
      "/events/": true,
      "/sdk/": true,
    },
  },
  ssm: {
    enabled: false,
  },
  gateways: {
    logger: {
      enabled: true,
      level: "debug",
    },
    mongoose: {
      uri: process.env.MONGODB_URI,
    },
  },
  analytics: {
    googleTid: "TODO: replace with your googleTid",
  },
  csp: {
    "default-src": ["none"],
    "manifest-src": ["self"],
    "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com/css"],
    "frame-src": [],
    "connect-src": [
      "self",
      "https://www.google-analytics.com/",
      ...(process.env.API_GATEWAY_URL ? [process.env.API_GATEWAY_URL] : []),
    ],
    "child-src": ["self"],
    "font-src": ["self", "data:", "https://fonts.gstatic.com/"],
    "img-src": ["*", "data:"],
    "media-src": ["self"],
    "object-src": ["self"],
    "script-src": ["self", "https://www.google-analytics.com/"],
  },
};