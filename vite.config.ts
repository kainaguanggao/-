import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保无论环境变量叫 API 还是 API_KEY，都能被注入到 process.env 中
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.API || ""),
  }
});