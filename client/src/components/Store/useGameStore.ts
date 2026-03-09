import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface PlayerStats {
    name: string;
    title?: string;
    health: number;
    experience: number;
    level: number;
    gold: number;
    nextLevelExp: number;
    maxHp: number;
}

interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    level: number;
    type: 'tool' | 'armor' | 'consumable';
    value: number;
    base_power?: number;
    base_defense?: number;
    healing_amount?: number;
    iconUrl: string;
}

interface GameState {
    player: PlayerStats;
    inventory: InventoryItem[];
    addGold: (amount: number) => void;
    addExperience: (amount: number) => void;
    addInventoryItem: (item: InventoryItem) => void;
    sellInventoryItem: (itemId: number, quantity: number) => void;
}

const useGameStore = create<GameState>()(
    persist(
    (set) => ({
    player: {
        name: 'PlayerOne',
        title: 'Novice Miner',
        health: 100,
        experience: 0,
        level: 1,
        gold: 0,
        nextLevelExp: 100,
        maxHp: 100,
    },
    inventory: [],

    addGold: (amount) => set((state) => ({ player: { ...state.player, gold: state.player.gold + amount } })),

    addExperience: (amount) => set((state) => 
        state.player.experience + amount >= state.player.nextLevelExp 
            ? {
                player: {
                    ...state.player,
                    experience: state.player.experience + amount - state.player.nextLevelExp,
                    level: state.player.level + 1,
                    nextLevelExp: Math.floor(state.player.nextLevelExp * 1.5),
                    maxHp: state.player.maxHp + 2,
                    health: state.player.maxHp + 2, 
                }
            }
            : {
                player: { ...state.player, experience: state.player.experience + amount }
            }
    ),
    addInventoryItem: (item) => set((state) => {
        const existingItemIndex = state.inventory.findIndex(i => i.id === item.id);
        if (existingItemIndex !== -1) {
            const updatedInventory = [...state.inventory];
            updatedInventory[existingItemIndex] = {
                ...updatedInventory[existingItemIndex],
                quantity: updatedInventory[existingItemIndex].quantity + item.quantity,
            };
            return { inventory: updatedInventory };
        }
        return { inventory: [...state.inventory, item] };
    }),
    sellInventoryItem: (itemId, sellQuantity) => set((state) => {
        const itemToSell = state.inventory.find(i => i.id === itemId);

        if (!itemToSell || itemToSell.quantity < sellQuantity) {
            return state; 
        }

        const goldEarned = (itemToSell.value || 0) * sellQuantity;

        const updatedInventory = state.inventory.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity - sellQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0);

        return {
            inventory: updatedInventory,
            player: { ...state.player, gold: state.player.gold + goldEarned }
        };
    }),
}),
{
    name: 'game-storage',
}
)
);

export default useGameStore;
