'use strict';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const envFilePath = path.resolve(_dirname, '../../.env');

dotenv.config({ path: envFilePath });

export const HOST = process.env.DB_HOST || process.env.HOST || 'localhost';
export const PORT = process.env.PORT || 3000;
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE || 'EnVivo';


export const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgresql://${encodeURIComponent(DB_USERNAME ?? '')}:${encodeURIComponent(DB_PASSWORD ?? '')}@${HOST}:${DB_PORT}/${DATABASE}?schema=public`;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET es obligatorio en produccion');
}
export const JWT_SECRET = process.env.JWT_SECRET || 'secreto_seguro';
// funciona pero no manda nada 
export const EMAIL_USER = process.env.EMAIL_USER;

export const EMAIL_PASS = process.env.EMAIL_PASS?.replace(/\s+/g, '');
export const APP_URL = process.env.APP_URL || 'http://localhost:5173';
