import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // also read backend local .env

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'eva_dev_secret_key_2026_thapar_university_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '../../../database/eva.db'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  INSTITUTE_DOMAIN: process.env.INSTITUTE_DOMAIN || 'thapar.edu',
  ALLOW_DEMO_EMAILS: process.env.ALLOW_DEMO_EMAILS !== 'false'
};

export default env;
