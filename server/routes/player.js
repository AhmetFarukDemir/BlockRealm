import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '@clerk/express';
import gameConfig from '../models/gameConfig.json' with { type: "json" };

const router = express.Router();

router.get('/me', requireAuth(), async (req, res) => {
    try {
        const authObj = req.auth();
        const clerkId = authObj.userId;

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching user data" });
    }
});


router.get('/config', requireAuth(), async (req, res) => {
    try {
        const authObj = req.auth();
        const clerkId = authObj.userId;

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the game configuration
        res.json(gameConfig);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching game config" });
    }
});

router.post('/buy', requireAuth(), async (req, res) => {
    const authObj = req.auth();
    const clerkId = authObj.userId;
    const { itemId, quantity } = req.body;
    const item = gameConfig.items[itemId];

    try {
        if (!item) {
            return res.status(400).json({ message: "Invalid item" });
        }
        const totalPrice = item.value * quantity;
        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.gold < totalPrice) {
            return res.status(400).json({ message: "Not enough gold" });
        }
        user.gold -= totalPrice;

        const itemIndex = user.inventory.findIndex(item => item.itemId === itemId);

        if (itemIndex > -1) {
            user.inventory[itemIndex].quantity += quantity;
        } else {
            user.inventory.push({ itemId, quantity });
        }

        await user.save();
        res.json({ message: "Purchase successful", user });

    } catch (error) {
        res.status(500).json({ message: "Error processing purchase" });
    }
});

router.post('/sell', requireAuth(), async (req, res) => {
    const authObj = req.auth();
    const clerkId = authObj.userId;
    const { itemId, quantity } = req.body;
    const item = gameConfig.items[itemId];

    try {
        if (!item) {
            return res.status(400).json({ message: "Invalid item" });
        }

        const totalPrice = item.value * quantity;
        const user = await User.findOne({ clerkId });


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const itemIndex = user.inventory.findIndex(item => item.itemId === itemId);

        if (itemIndex === -1 || user.inventory[itemIndex].quantity < quantity) {
            return res.status(400).json({ message: "Not enough items to sell" });
        }

        if (user.inventory[itemIndex].quantity === quantity) {
            user.inventory.splice(itemIndex, 1);
        } else {
            user.inventory[itemIndex].quantity -= quantity;
        }
        user.gold += totalPrice;

        await user.save();
        res.json({ message: "Sale successful", user });

    } catch (error) {
        res.status(500).json({ message: "Error processing sale" });
    }
});

router.post('/mine', requireAuth(), async (req, res) => {
    const authObj = req.auth();
    const clerkId = authObj.userId;
    const { clicks } = req.body;

    if (!clicks || clicks <= 0) {
        return res.status(400).json({ message: "Invalid click count" });
    }

    // Max limit for postman attacks
    const maxClicksAllowed = 50;
    const validClicks = Math.min(clicks, maxClicksAllowed);

    try {
        const totalWeight = gameConfig.miningLootTable.reduce((sum, loot) => sum + loot.chance, 0);

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.xp += validClicks * 15;

        for (let i = 0; i < validClicks; i++) {
            let rng = Math.random() * totalWeight;

            for (const loot of gameConfig.miningLootTable) {
                rng -= loot.chance;
                if (rng <= 0) {
                    const itemIndex = user.inventory.findIndex(item => item.itemId === loot.itemId);

                    if (itemIndex > -1) {
                        user.inventory[itemIndex].quantity += 1;
                    } else {
                        user.inventory.push({ itemId: loot.itemId, quantity: 1 });
                    }
                    break;
                }
            }
        }

        await user.save();
        res.json({ message: "Mining successful", user, processedClicks: validClicks });

    } catch (error) {
        console.error("Error processing mining:", error);
        res.status(500).json({ message: "Error processing mining" });
    }
});

router.post('/craft', requireAuth(), async (req, res) => {
    const authObj = req.auth();
    const clerkId = authObj.userId;
    const { recipeId } = req.body;
    const recipe = gameConfig.recipes[recipeId];

    try {
        if (!recipe) {
            return res.status(400).json({ message: "Invalid recipe" });
        }
        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        for (const ingredient of recipe.ingredients) {
            const itemInInventory = user.inventory.find(item => item.itemId === ingredient.itemId);
            if (!itemInInventory || itemInInventory.quantity < ingredient.quantity) {
                return res.status(400).json({ message: "Not enough materials" });
            }
        }
        if (user.gold < recipe.goldCost) {
            return res.status(400).json({ message: "Not enough gold" });
        }
        user.gold -= recipe.goldCost; 
        for (const ingredient of recipe.ingredients) {
            const itemIndex = user.inventory.findIndex(item => item.itemId === ingredient.itemId);
            if (itemIndex > -1) {
                if (user.inventory[itemIndex].quantity === ingredient.quantity) {
                    user.inventory.splice(itemIndex, 1);
                } else {
                    user.inventory[itemIndex].quantity -= ingredient.quantity;
                }
            }
        }
        const resultItemId = recipe.result.itemId;
        const resultQuantity = recipe.result.quantity;
        const resultItemIndex = user.inventory.findIndex(item => item.itemId === resultItemId);
        if (resultItemIndex > -1) {
            user.inventory[resultItemIndex].quantity += resultQuantity;
        } else {
            user.inventory.push({ itemId: resultItemId, quantity: resultQuantity });
        }

        await user.save();
        res.json({ message: "Crafting successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error processing crafting" });
    }
});
export default router;
