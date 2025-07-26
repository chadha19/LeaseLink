#!/bin/bash
# Build script for Vercel deployment

# Build the application
npm run build

# Copy frontend files to public directory
rm -rf public/*
cp -r dist/public/* public/

echo "Build completed successfully"
echo "Frontend files copied to public/"
echo "API server ready at api/server.ts"