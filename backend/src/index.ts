import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import { setupRoutes } from './routes';
import fs from 'fs';
import path from 'path';
import { startAlertEvaluationService } from './services/alertEvaluationService';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Server port
const PORT = process.env.PORT || 3001;

// Start server
async function start() {
  try {
    // Initialize database schema
    const schema = fs.readFileSync(path.join(__dirname, 'config', 'schema.sql'), 'utf8');
    await pool.query(schema);
    
    // Setup routes
    setupRoutes(app);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startAlertEvaluationService();
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await pool.end();
      process.exit(0);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

// Start the application
start(); 