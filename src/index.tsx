/* eslint-disable @typescript-eslint/no-unused-vars */
import { serve } from "bun";

import index from "./index.html";

const server = serve({
  development: process.env.NODE_ENV !== "production" && {
    // Echo console logs from the browser to the server
    console: true,

    // Enable browser hot reloading in development
    hmr: true,
  },

  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      // @ts-expect-error TODO: fix ts
      // biome-ignore lint/correctness/noUnusedFunctionParameters: <>
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      // @ts-expect-error TODO: fix ts
      // biome-ignore lint/correctness/noUnusedFunctionParameters: <>
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },
});

console.log(`🚀 Server running at ${server.url}`);
