import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import dotenv from 'dotenv';
dotenv.config();

import { authLogin } from './auth.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.json());
app.use(cookieParser());

// When remixing this, update the cors origin to your new live site under the Share button in the top right
app.use(
  express.urlencoded({ extended: true }),
  cors({ origin: 'https://knotty-angry-suggestion.glitch.me/' })
);
app.post('/login', async (req, res, next) => {
  authLogin(req, res, next);
});

app.listen(port, () => {
  console.log(
    `Server is running. If running locally, it is running on port ${port}.`
  );
});
