import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite + React setup. Netlify and Vercel both detect this automatically.
export default defineConfig({
  plugins: [react()],
});
