// playwright.global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🏗️ Building project for E2E tests...');
  const { execSync } = require('child_process');
  
  try {
    // Build the project
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

export default globalSetup;
