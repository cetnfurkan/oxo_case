import express from 'express';
import apkRoutes from './routes/apkRoutes';
import authMiddleware from './middlewares/authMiddleware';

/**
 * @name app
 * @description Initializes the Express application, sets up middleware for JSON parsing and authentication, and defines the API routes.
 */
const app = express();
app.use(express.json());
app.use(authMiddleware);
app.use('/api', apkRoutes);

export default app;
