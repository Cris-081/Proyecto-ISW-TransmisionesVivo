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

// Correo (nodemailer). Si MAIL_HOST no esta definido la app funciona igual, pero no envia correos
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = Number(process.env.MAIL_PORT) || 587;
export const MAIL_SECURE = process.env.MAIL_SECURE === 'true';
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;
export const MAIL_FROM = process.env.MAIL_FROM || process.env.MAIL_USER;
export const APP_URL = process.env.APP_URL || 'http://localhost:5173';
