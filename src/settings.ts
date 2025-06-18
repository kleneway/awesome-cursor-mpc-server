// Get settings for the MCP server from environment variables, or use defaults.
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// Try to load legacy API key from ../env/keys.ts if it exists (for backwards compatibility)
//  This behaviour is deprecated and will be removed in a future version.
const loadLegacyApiKey = async (): Promise<string | undefined> => {
  try {
    const legacyKeysPath = path.join(__dirname, '..', 'env', 'keys.ts');
    if (fs.existsSync(legacyKeysPath)) {
      const keys = await import(legacyKeysPath);
      return keys.OPENAI_API_KEY;
    }
  } catch (error) {
    console.warn('[loadLegacyApiKey] Failed to load legacy API key:', error);
  }
  return undefined;
};

// Environment variables schema.
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  OPENAI_BASE_URL: z.string().min(1, 'OpenAI base URL is required').optional(),
  OPENAI_MODEL: z.string().default('o3-mini-2025-01-31'),
  CODE_REVIEW_TARGET_BRANCH_NAME: z.string().default('main'),
});

// Type for the validated environment variables.
export type Env = z.infer<typeof envSchema>;

// Validate environment variables.
const validateEnv = async () => {
  try {
    const legacyKey = await loadLegacyApiKey();
    // Use legacy key if environment variable is not set
    if (!process.env.OPENAI_API_KEY && legacyKey) {
      process.env.OPENAI_API_KEY = legacyKey;
    }
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

// Export validated environment variables.
export const env = await validateEnv();

// Export individual settings for convenience.
export const settings = {
  OPENAI_API_KEY: env.OPENAI_API_KEY,
  OPENAI_BASE_URL: env.OPENAI_BASE_URL ?? undefined,
  OPENAI_MODEL: env.OPENAI_MODEL,
  CODE_REVIEW_TARGET_BRANCH_NAME: env.CODE_REVIEW_TARGET_BRANCH_NAME,
} as const;
