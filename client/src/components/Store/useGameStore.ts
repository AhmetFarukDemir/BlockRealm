import { create } from "zustand";

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
  itemId: number;
  quantity: number;
}

interface GameDictionary {
  items: {
    [id: number]: {
      name: string;
      description: string;
      type: "tool" | "armor" | "consumable" | "material" | string;
      value: number;
      iconUrl: string;
    };
  };
  miningLootTable: {
    itemId: number;
    chance: number;
  }[];
  recipes: {
    [id: number]: {
      ingredients: { itemId: number; quantity: number }[];
      result: { itemId: number; quantity: number };
      description?: string;
    };
  };
}

interface GameState {
  player: PlayerStats;
  inventory: InventoryItem[];
  gameDictionary?: GameDictionary;
  setGameDictionary: (dict: GameDictionary) => void;
  setUserData: (dbUser: any) => void;
  addGold: (amount: number) => void;
  addExperience: (amount: number) => void;
}

const useGameStore = create<GameState>()((set) => ({
  player: {
    name: "PlayerOne",
    title: "Novice Miner",
    health: 100,
    experience: 0,
    level: 1,
    gold: 0,
    nextLevelExp: 100,
    maxHp: 100,
  },
  inventory: [],

  setGameDictionary: (dict) => set(() => ({ gameDictionary: dict })),

  setUserData: (dbUser) =>
    set((state) => {
      // Algorithm for calculating the player's actual level and leftover XP from total XP
      let currentLevel = 1;
      let requiredExp = 100;
      let leftoverExp = dbUser.xp;

      while (leftoverExp >= requiredExp) {
        leftoverExp -= requiredExp;
        currentLevel++;
        requiredExp = Math.floor(requiredExp * 1.5);
      }

      return {
        player: {
          ...state.player,
          name: dbUser.username,
          gold: dbUser.gold,
          health: dbUser.hp,
          experience: leftoverExp, 
          level: currentLevel, 
          nextLevelExp: requiredExp,
          maxHp: 100 + (currentLevel - 1) * 2, // +2 MaxHP per level
        },
        inventory: dbUser.inventory,
      };
    }),

  addGold: (amount) =>
    set((state) => ({
      player: { ...state.player, gold: state.player.gold + amount },
    })),

  addExperience: (amount) =>
    set((state) =>
      state.player.experience + amount >= state.player.nextLevelExp
        ? {
            player: {
              ...state.player,
              experience:
                state.player.experience + amount - state.player.nextLevelExp,
              level: state.player.level + 1,
              nextLevelExp: Math.floor(state.player.nextLevelExp * 1.5),
              maxHp: state.player.maxHp + 2,
              health: state.player.maxHp + 2,
            },
          }
        : {
            player: {
              ...state.player,
              experience: state.player.experience + amount,
            },
          },
    ),
}));

export default useGameStore;
