#!/usr/bin/env node

// Simple build script for Vercel
const { execSync } = require('child_process');

console.log('Building frontend with Vite...');
execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });

console.log('Build completed successfully!');