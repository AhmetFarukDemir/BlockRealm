import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import playerRoutes from './routes/player.js';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));


app.head('/', (req, res) => {
    res.status(200).end();
});


// WEBHOOK ROUTE
app.use('/api/webhooks', webhookRoutes);

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(clerkMiddleware()); // Add Clerk middleware to handle authentication and user sessions

// API ROUTES
app.use('/players', playerRoutes);

const uri = process.env.MONGO_URI;

app.get('/', (req, res) => {
    res.json({ "message": "BlockRealm Server is alive!" })
});

try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}
