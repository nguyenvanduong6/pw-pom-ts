import { chromium, BrowserContext } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

type UserRole = 'user' | 'admin';

interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Creates an authenticated session and saves storage state
 */
const createAuthenticatedSession = async (
  baseUrl: string,
  credentials: UserCredentials,
  role: UserRole,
): Promise<void> => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(baseUrl + '/login');
    await page.locator('input[data-qa="login-email"]').fill(credentials.email);
    await page.locator('input[data-qa="login-password"]').fill(credentials.password);

    await Promise.all([
      page.waitForURL(baseUrl, { timeout: 10000 }),
      page.locator('button[data-qa="login-button"]').click(),
    ]);

    // Ensure auth directory exists
    const authDir = path.join(process.cwd(), '.auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Save storage state for the role
    const storageStatePath = path.join(authDir, `${role}.json`);
    await context.storageState({ path: storageStatePath });

    console.log(`✓ Authentication state saved for role: ${role}`);
  } catch (error) {
    console.error(`✗ Failed to create authentication for role: ${role}`, error);
    throw error;
  } finally {
    await browser.close();
  }
};

/**
 * Generates authentication states for all roles
 */
const authFixtures = async (env: string): Promise<void> => {
  dotenv.config({ path: `.env.${env}` });
  const baseUrl = process.env.BASE_URL!;

  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is required');
  }

  const roles: UserRole[] = ['user', 'admin'];
  const credentials: Record<UserRole, UserCredentials> = {
    user: {
      email: process.env.USER_EMAIL!,
      password: process.env.USER_PASSWORD!,
    },
    admin: {
      email: process.env.ADMIN_EMAIL || process.env.USER_EMAIL!,
      password: process.env.ADMIN_PASSWORD || process.env.USER_PASSWORD!,
    },
  };

  console.log(`Generating authentication states for environment: ${env}`);

  for (const role of roles) {
    const creds = credentials[role];
    if (!creds.email || !creds.password) {
      console.warn(`⚠ Skipping ${role}: credentials not found`);
      continue;
    }

    try {
      await createAuthenticatedSession(baseUrl, creds, role);
    } catch (error) {
      console.error(`Failed to generate auth for ${role}:`, error);
      process.exit(1);
    }
  }

  console.log('✓ All authentication states generated successfully');
};

const env = (process.argv[2] as 'ci' | 'example' | 'dev' | 'stg' | 'prod') || 'dev';
authFixtures(env).catch((error) => {
  console.error('Error generating auth:', error);
  process.exit(1);
});
