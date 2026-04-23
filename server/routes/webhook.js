import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// express.raw() for verifying the webhook signature with the raw body
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        console.error("Zort: CLERK_WEBHOOK_SIGNING_SECRET eksik!");
        return res.status(500).json({ error: 'Signing secret missing' });
    }

    // Headers for Svix signature verification
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Missing svix headers' });
    }

    // req.body is a Buffer because of express.raw(), we need to convert it to string for verification
    const payload = req.body.toString();
    const wh = new Webhook(SIGNING_SECRET);

    let evt;
    try {
        // Verify the webhook signature and parse the event
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Verification error' });
    }

    if (evt.type === 'user.created') {
        const { id, username, first_name } = evt.data;
        
        // if username is not provided, use first_name or fallback to a generic name with the last 4 characters of the id
        const displayName = username || first_name || `Player_${id.slice(-4)}`;

        try {
            const newUser = new User({
                clerkId: id,
                username: displayName
                // gold, hp, xp, inventory is already set to default values in the User model
            });
            await newUser.save();
            console.log(`[Webhook] New user added to DB: ${displayName}`);
        } catch (dbError) {
            console.error('[Webhook] MongoDB Record Error:', dbError);
            return res.status(500).json({ error: 'Database error' });
        }
    }

    res.status(200).json({ success: true, message: 'Webhook received' });
});

export default router;
