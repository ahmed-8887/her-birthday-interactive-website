import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (with 50MB payload limit for audio/video recordings)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve saved messages/media statically if needed
app.use('/messages', express.static(path.join(__dirname, 'messages')));

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Her Birthday API Service',
    healthCheck: '/api/health',
  });
});

app.listen(PORT, () => {
  console.log(`[Her Birthday Server] Running on http://localhost:${PORT}`);
});
