import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import importRoutes from './routes/import';
import extractRoutes from './routes/extract';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/health', healthRoutes);
app.use('/api/import', importRoutes);
app.use('/api/extract', extractRoutes);

// Centralized Error Handling (must be last)
app.use(errorHandler);

export default app;
