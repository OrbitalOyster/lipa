#!/bin/bash

cd auth-mockup && bun run index.ts &
cd client && npm run dev
