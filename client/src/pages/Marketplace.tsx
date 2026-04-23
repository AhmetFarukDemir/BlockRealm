import { useState } from "react";
import useGameStore from "../components/Store/useGameStore";
import InventoryItem from "../components/Layout/Inventory/InventoryItem";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/react";

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  const inventory = useGameStore((state) => state.inventory);
  const player = useGameStore((state) => state.player);
  const gameDictionary = useGameStore((state) => state.gameDictionary);
  const setUserData = useGameStore((state) => state.setUserData);
  const { getToken } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  if (!gameDictionary)
    return <div className="p-4 text-neutral-500">Loading Data...</div>;

  const buyItem = async (itemId: number, value: number) => {
    if (player.gold < value) return; // Frontend UI protection
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/players/buy`,
        { itemId: itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data.user);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error:", axiosError.response?.data?.message || axiosError.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const sellItem = async (itemId: number, quantity: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/players/sell`,
        { itemId: itemId, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data.user);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error:", axiosError.response?.data?.message || axiosError.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col h-full p-10 overflow-y-auto bg-neutral-950"
    >
      {/* HEADER */}
      <div className="mb-10 border-b border-orange-900/50 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-300 tracking-wider mb-3">
            MARKETPLACE
          </h1>
          <p className="text-neutral-400 text-lg">
            Welcome to the <span className="text-orange-500 font-bold">Marketplace</span>. Sell your gathered ores for gold and buy rare items.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Your Balance</p>
          <div className="px-4 py-2 bg-neutral-900 border border-yellow-500/30 rounded-lg text-xl font-black text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            {player.gold} <span className="text-sm">🪙</span>
          </div>
        </div>
      </div>

      {/* SELL/BUY TABS */}
      <div className="flex bg-neutral-900 p-1 rounded-lg mb-8 border border-neutral-800 w-full max-w-md">
        <button
          onClick={() => setActiveTab("sell")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${activeTab === "sell" ? "bg-orange-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Sell Items
        </button>
        <button
          onClick={() => setActiveTab("buy")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${activeTab === "buy" ? "bg-orange-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Buy Items
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "sell" ? (
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl min-h-100">
          {inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 pt-20">
              <span className="text-6xl mb-4 opacity-20">🕸️</span>
              <p className="text-xl font-bold">Your inventory is empty.</p>
              <p className="text-sm">Go to the Surface Mine and gather some resources first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {inventory.map((item) => {
                const targetId = item.itemId || item.id;
                const dictItem = gameDictionary.items[targetId];
                if (!dictItem) return null;

                return (
                  <div key={item.id || targetId} className="flex flex-col sm:flex-row items-center justify-between bg-neutral-950 border border-neutral-800 rounded-lg p-3 gap-4 hover:border-neutral-700 transition-colors shadow-sm">
                    <div className="flex-1 w-full pointer-events-none">
                      <InventoryItem
                        id={targetId}
                        name={dictItem.name}
                        quantity={item.quantity}
                        type={dictItem.type}
                        rarity={"common"}
                        iconUrl={dictItem.iconUrl}
                        value={dictItem.value}
                        level={1}
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:border-l sm:border-neutral-800 sm:pl-4">
                      <div className="text-right hidden sm:block mr-2">
                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Value</p>
                        <p className="text-lg font-black text-yellow-500">{dictItem.value} <span className="text-sm">🪙</span></p>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button onClick={() => sellItem(targetId, 1)} disabled={isProcessing} className="flex-1 sm:flex-none bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-200 font-bold py-2 px-4 rounded border border-neutral-700 transition-colors whitespace-nowrap">
                          Sell 1
                        </button>
                        <button onClick={() => sellItem(targetId, item.quantity)} disabled={isProcessing} className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors whitespace-nowrap shadow-md shadow-orange-900/20">
                          Sell All
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl min-h-100">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Object.entries(gameDictionary.items).map(([idString, dictItem]) => {
              const itemId = parseInt(idString);
              // Optional: I can also choose to only list consumables or tools, and exclude materials (like stone, iron) from the marketplace by adding an if condition here.

              const canAfford = player.gold >= dictItem.value;

              return (
                <div key={itemId} className="flex flex-col sm:flex-row items-center justify-between bg-neutral-950 border border-neutral-800 rounded-lg p-3 gap-4 hover:border-neutral-700 transition-colors shadow-sm">
                  <div className="flex-1 w-full pointer-events-none">
                    <InventoryItem
                      id={itemId}
                      name={dictItem.name}
                      quantity={1}
                      type={dictItem.type}
                      rarity={"common"}
                      iconUrl={dictItem.iconUrl}
                      value={dictItem.value}
                      level={1}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto sm:border-l sm:border-neutral-800 sm:pl-4">
                    <div className="text-right hidden sm:block mr-2">
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Price</p>
                      <p className={`text-lg font-black ${canAfford ? 'text-yellow-500' : 'text-red-500'}`}>
                        {dictItem.value} <span className="text-sm">🪙</span>
                      </p>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => buyItem(itemId, dictItem.value)} 
                        disabled={isProcessing || !canAfford}
                        className={`flex-1 sm:flex-none font-bold py-2 px-6 rounded border transition-colors whitespace-nowrap ${
                          canAfford && !isProcessing 
                            ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700" 
                            : "bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed"
                        }`}
                      >
                        Buy 1
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Marketplace;
