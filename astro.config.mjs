import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Set to false to avoid issues with S3 routing
    format: 'directory'
  },
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(), // Add
    ],
  },
});