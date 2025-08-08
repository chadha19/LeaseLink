#!/usr/bin/env node

// Railway deployment startup script
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚂 Starting LeaseLink on Railway...');
console.log('📁 Working directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔗 Railway URL:', process.env.RAILWAY_STATIC_URL);

// Set production environment
process.env.NODE_ENV = 'production';

// Log environment variables (safely)
console.log('Environment check:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('- SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Missing');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- PORT:', process.env.PORT || '5000');

// Start the server
const server = spawn('node', [join(__dirname, 'dist', 'index.js')], {
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || '5000' }
});

server.on('error', (err) => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🔴 Server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});