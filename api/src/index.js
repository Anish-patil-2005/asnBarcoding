import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './database/connection.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import asnRoutes from './routes/asn.routes.js';
import receiptRoutes from './routes/receipt.routes.js';
import statusRoutes from './routes/status.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

// connect to DB
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// mount routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/asn', asnRoutes);
app.use('/api/v1/asn', receiptRoutes);
app.use('/api/v1/asn/status', statusRoutes);

// error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));