import { motion } from "framer-motion";

const Blacksmith = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col h-full p-10 overflow-y-auto bg-neutral-950 select-none"
    >
      {/* HEADER */}
      <div className="mb-10 border-b border-orange-900/50 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400 tracking-wider mb-3">
            BLACKSMITH
          </h1>
          <p className="text-neutral-400 text-lg">
            Welcome to the forge. Upgrade your gear or smelt rare ores.
          </p>
        </div>
        <div className="hidden md:block px-4 py-2 bg-neutral-900/80 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.1)]">
          Status: Forging Logic WIP 🛠️
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: UPGRADE GEAR */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-xl relative overflow-hidden">
          <h2 className="text-2xl font-bold text-neutral-200 mb-6 flex items-center gap-3 border-b border-neutral-800 pb-4">
            <span className="text-orange-500 text-3xl">⚔️</span> Upgrade Gear
          </h2>
          
          <div className="flex flex-col gap-4 opacity-75 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            {/* Pickaxe Upgrade Card */}
            <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-md border border-neutral-700 flex items-center justify-center text-2xl">
                  ⛏️
                </div>
                <div>
                  <h3 className="text-neutral-200 font-bold">Iron Pickaxe</h3>
                  <p className="text-xs text-neutral-500">Currently: Common Stone</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400 mb-1">Cost</p>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-neutral-300">15 Iron</span>
                  <span className="text-yellow-500">500 🪙</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-neutral-800 text-neutral-500 font-bold rounded-lg border border-neutral-700 cursor-not-allowed">
              Upgrade Locked (WIP)
            </button>
          </div>
        </div>

        {/* RIGHT: SMELTER */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-xl relative overflow-hidden group">
          {/* Alev Efekti (Arka plan dekoru) */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-600 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-neutral-200 mb-6 flex items-center gap-3 border-b border-neutral-800 pb-4">
            <span className="text-orange-500 text-3xl">🔥</span> The Smelter
          </h2>
          
          <div className="flex flex-col items-center justify-center h-48 bg-neutral-950 border border-neutral-800 rounded-lg border-dashed">
            <span className="text-5xl mb-3 opacity-50 grayscale group-hover:grayscale-0 transition-all">🧱</span>
            <p className="text-neutral-500 font-medium">Drag and drop raw ores here</p>
            <p className="text-xs text-neutral-600 mt-2">Smelting mechanics coming in v1.1</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Blacksmith;
