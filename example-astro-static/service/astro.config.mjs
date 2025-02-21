import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

/**
 * Astro configuration for Serverless Container Framework.
 *
 * @module AstroConfig
 */
export default defineConfig({
  output: 'server',
  adapter: node({
    // Use 'standalone' mode so that the server code is bundled
    mode: 'standalone'
  }),
  server: {
    port: 8080,
    host: true
  },
  vite: {
    server: {
      allowedHosts: ['service'] // Named after your container name
    }
  }
});
