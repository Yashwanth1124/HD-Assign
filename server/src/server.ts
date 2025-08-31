import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Load env from project root (.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import authRouter from './routes/auth';
import notesRouter from './routes/notes';
import googleRouter from './routes/google';
import User from './models/User';

const app = express();
app.use(
  cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true })
);
app.use(express.json());
app.use(cookieParser());

const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Ensure Mongoose indexes reflect current schema (fixes stale unique indexes)
    try {
      await mongoose.connection.db.command({ ping: 1 });
      await mongoose.syncIndexes();
      console.log('Mongoose indexes synchronized');
    } catch (e) {
      console.warn('Index sync skipped/failed:', (e as Error).message);
    }
  })
  .catch((e) => {
    console.error('MongoDB connection error', e);
    process.exit(1);
  });

app.use('/api/auth', authRouter);
app.use('/api/auth', googleRouter);
app.use('/api/notes', notesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));