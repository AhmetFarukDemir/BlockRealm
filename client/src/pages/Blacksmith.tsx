import { useState } from "react";
import { motion } from "framer-motion";
import useGameStore from "../components/Store/useGameStore";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/react";

const Blacksmith = () => {
  const inventory = useGameStore((state) => state.inventory);
  const player = useGameStore((state) => state.player);
  const gameDictionary = useGameStore((state) => state.gameDictionary);
  const setUserData = useGameStore((state) => state.setUserData);
  const { getToken } = useAuth();

  const [isCrafting, setIsCrafting] = useState(false);

  if (!gameDictionary || !gameDictionary.recipes) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        The Forge is currently cold. Loading recipes...
      </div>
    );
  }

  const inventoryMap = inventory.reduce((acc: Record<number, number>, item) => {
    const id = item.itemId || item.id;
    acc[id] = item.quantity;
    return acc;
  }, {});

  const handleCraft = async (recipeId: string) => {
    if (isCrafting) return;
    setIsCrafting(true);

    try {
      const token = await getToken();
      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/players/craft",
        { recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUserData(response.data.user);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Örs başında zortladık:", axiosError.response?.data?.message || axiosError.message);
    } finally {
      setIsCrafting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col h-full p-10 overflow-y-auto bg-neutral-950 select-none"
    >
      <div className="mb-10 border-b border-orange-900/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400 tracking-wider mb-3">
            THE FORGE
          </h1>
          <p className="text-neutral-400 text-lg">
            Smelt ores and forge powerful gear. If you have the materials, the anvil is yours.
          </p>
        </div>
        <div className="px-4 py-2 bg-orange-900/20 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.1)]">
          Anvil is Hot 🔥
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Object.entries(gameDictionary.recipes).map(([recipeId, recipe]: [string, any]) => {
          const resultItem = gameDictionary.items[recipe.result.itemId];
          if (!resultItem) return null;

          const hasEnoughMaterials = recipe.ingredients.every(
            (ing: any) => (inventoryMap[ing.itemId] || 0) >= ing.quantity
          );
          
          const goldCost = recipe.goldCost || 0;
          const hasEnoughGold = player.gold >= goldCost;

          const canCraft = hasEnoughMaterials && hasEnoughGold;

          return (
            <div
              key={recipeId}
              className={`flex flex-col bg-neutral-900/40 border p-6 rounded-xl relative overflow-hidden transition-all duration-300 ${
                canCraft ? "border-orange-900/50 hover:border-orange-500/50 shadow-lg" : "border-neutral-800 opacity-80"
              }`}
            >
              {canCraft && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600 rounded-full blur-[80px] opacity-10 pointer-events-none" />
              )}

              <div className="flex items-center gap-4 mb-6 border-b border-neutral-800/50 pb-4">
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center text-3xl">
                  <img src={resultItem.iconUrl} alt={resultItem.name} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-100">{resultItem.name}</h2>
                  <p className="text-sm text-neutral-500">{recipe.description || `Craft 1x ${resultItem.name}`}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-auto">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Required Materials</p>
                  <div className="flex flex-col gap-2">
                    
                    {goldCost > 0 && (
                      <div className="flex items-center justify-between bg-neutral-950/50 p-2 rounded border border-neutral-800/50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🪙</span>
                          <span className="text-sm font-medium text-neutral-300">Gold</span>
                        </div>
                        <div className={`text-sm font-bold ${hasEnoughGold ? "text-yellow-500" : "text-red-500"}`}>
                          {player.gold} / {goldCost}
                        </div>
                      </div>
                    )}

                    {recipe.ingredients.map((ing: any, idx: number) => {
                      const ingDict = gameDictionary.items[ing.itemId];
                      const currentAmount = inventoryMap[ing.itemId] || 0;
                      const hasEnough = currentAmount >= ing.quantity;

                      return (
                        <div key={idx} className="flex items-center justify-between bg-neutral-950/50 p-2 rounded border border-neutral-800/50">
                          <div className="flex items-center gap-2">
                            <img src={ingDict?.iconUrl} alt={ingDict?.name} className="w-6 h-6" />
                            <span className="text-sm font-medium text-neutral-300">{ingDict?.name}</span>
                          </div>
                          <div className={`text-sm font-bold ${hasEnough ? "text-green-500" : "text-red-500"}`}>
                            {currentAmount} / {ing.quantity}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-end">
                  <button
                    onClick={() => handleCraft(recipeId)}
                    disabled={!canCraft || isCrafting}
                    className={`w-full sm:w-32 py-3 font-bold rounded-lg transition-all duration-200 ${
                      canCraft
                        ? "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95"
                        : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                    }`}
                  >
                    {isCrafting ? "Forging..." : "Forge"}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Blacksmith;
