import { useState } from "react";
import useGameStore from "../components/Store/useGameStore";
import InventoryItem from "../components/Layout/Inventory/InventoryItem"; 
import { motion } from "framer-motion";

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  const inventory = useGameStore((state) => state.inventory);
  const sellInventoryItem = useGameStore((state) => state.sellInventoryItem);

  return (
    <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex flex-col h-full p-10 overflow-y-auto bg-neutral-950">
      
      {/* HEADER */}
      <div className="mb-10 border-b border-orange-900/50 pb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-300 tracking-wider mb-3">
          MARKETPLACE
        </h1>
        <p className="text-neutral-400 text-lg">
          Welcome to the <span className="text-orange-500 font-bold">Marketplace</span>. Sell your gathered ores for gold and buy rare items.
        </p>
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
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl min-h-100 ">
          {inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 pt-20">
              <span className="text-6xl mb-4 opacity-20">🕸️</span>
              <p className="text-xl font-bold">Your inventory is empty.</p>
              <p className="text-sm">Go to the Surface Mine and gather some resources first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4"> 
                {inventory.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-neutral-950 border border-neutral-800 rounded-lg p-3 gap-4 hover:border-neutral-700 transition-colors shadow-sm">
                        
                        {/* Left Part */}
                        <div className="flex-1 w-full pointer-events-none">
                            <InventoryItem
                                id={item.id}
                                name={item.name}
                                quantity={item.quantity}
                                level={item.level}
                                type={item.type}
                                rarity={item.rarity}
                                iconUrl={item.iconUrl}
                                value={item.value}
                            />
                        </div>
                        
                        {/* Right part */}
                        <div className="flex items-center gap-3 w-full sm:w-auto sm:border-l sm:border-neutral-800 sm:pl-4">
                            <div className="text-right hidden sm:block mr-2">
                                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Value</p>
                                <p className="text-lg font-black text-yellow-500">{item.value} <span className="text-sm">🪙</span></p>
                            </div>
                            <div className="flex gap-2 w-full">
                                <button 
                                  onClick={() => sellInventoryItem(item.id, 1)} 
                                  className="flex-1 sm:flex-none bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold py-2 px-4 rounded border border-neutral-700 transition-colors whitespace-nowrap"
                                >
                                  Sell 1
                                </button>
                                <button 
                                  onClick={() => sellInventoryItem(item.id, item.quantity)} 
                                  className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition-colors whitespace-nowrap shadow-md shadow-orange-900/20"
                                >
                                  Sell All
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-neutral-900/50 border border-neutral-800 p-20 rounded-xl flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-4">🛒</span>
          <h2 className="text-2xl font-bold text-neutral-300 mb-2">Merchant is out of town.</h2>
          <p className="text-neutral-500">Buying items will be available in a future update.</p>
          <div className="mt-6 inline-block px-4 py-1.5 bg-neutral-950 text-orange-500 text-xs font-bold rounded border border-orange-900/50">
            Work In Progress 🔒
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Marketplace;
