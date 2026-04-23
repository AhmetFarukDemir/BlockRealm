import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex flex-col h-full p-10 overflow-y-auto bg-neutral-950 select-none">
      {/* HEADER */}
      <div className="mb-14 border-b border-orange-900/50 pb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-300 tracking-wider mb-3">
          BLOCKREALM
        </h1>
        <p className="text-neutral-400 text-lg">
          Welcome to the <span className="text-orange-500">surface</span>. Gather resources, upgrade your gear, and
          survive.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* CRAFTING */}
        <Link to="/blacksmith">
          <div className="bg-neutral-900/80 border border-orange-900/30 p-8 rounded-xl relative overflow-hidden group hover:border-orange-500/50 transition-colors">
            <div className="absolute inset-0 bg-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-bold text-neutral-200 mb-3 flex items-center gap-3">
              <span className="text-orange-500">⚒️</span> Blacksmith
            </h2>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Upgrade your pickaxe and armor to mine faster and survive longer.
            </p>
            <div className="inline-block px-7 py-2 bg-neutral-950 text-orange-500/70 text-xs font-bold rounded border border-orange-900/50">
                Enter
            </div>
          </div>
        </Link>

        {/* MARKETPLACE */}
        <Link to="/marketplace">
          <div className="bg-neutral-900/80 border border-orange-900/30 p-8 rounded-xl relative overflow-hidden group hover:border-orange-500/50 transition-colors ">
            <div className="absolute inset-0 bg-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-bold text-neutral-200 mb-3 flex items-center gap-3">
              <span className="text-orange-500">⚖️</span> Marketplace
            </h2>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Sell your gathered ores for gold and buy rare items.
            </p>
            <div className="inline-block px-7 py-2 bg-neutral-950 text-orange-500/70 text-xs font-bold rounded border border-orange-900/50">
              Enter
            </div>
          </div>
        </Link>
      </div>

      {/* TRAVEL HUB */}
      <div>
        <h2 className="text-2xl font-bold text-orange-400/80 mb-8 border-b border-neutral-800 pb-2 inline-block">
          Travel Hub
        </h2>
        <div className="flex flex-col gap-6">
          
          <Link to="/mine" className="block group">
            <div className="flex items-center justify-between bg-neutral-900 border-2 border-orange-900/40 group-hover:border-orange-500 p-6 rounded-xl transition-all shadow-lg">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                  Surface Mine
                </h3>
                <p className="text-sm text-neutral-400">
                  A safe area to gather basic resources like Stone and Wood.
                </p>
              </div>
              <div className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors shadow-md">
                Enter
              </div>
            </div>
          </Link>

          {/* CAVES (WIP) */}
          <div className="flex items-center justify-between bg-neutral-950 border border-neutral-900 p-6 rounded-xl opacity-60">
            <div>
              <h3 className="text-xl font-bold text-neutral-500 mb-1">
                Goblin Caves
              </h3>
              <p className="text-sm text-neutral-600">
                Fight goblins and mine iron ores. High risk, high reward.
              </p>
            </div>
            <div className="px-5 py-2.5 bg-neutral-900 text-neutral-500 font-bold rounded-lg border border-neutral-800">
              Requires Lvl 10 🔒
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
