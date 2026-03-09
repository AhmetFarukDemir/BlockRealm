import useGameStore from '../components/Store/useGameStore.ts'
import { motion } from 'framer-motion';


const Mine = () => {
  
  const addExperience = useGameStore(state => state.addExperience);
  const addInventoryItem = useGameStore(state => state.addInventoryItem);
  
  const handleMine = () => {

    addExperience(15);
    addInventoryItem({
        id: 1, // Id from DB in the future, static for now
        name: 'Common Stone',
        quantity: 1,
        rarity: 'common',
        level: 0,
        type: 'consumable',
        iconUrl: 'icons/stone.png',
        value: 5,
    });
}

  return (
    <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-800 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <h1 className="text-3xl font-bold text-neutral-100 mb-2 select-none">Surface Mine</h1>
      <p className="text-neutral-500 mb-12 select-none">Click the rock to gather resources.</p>

      {/* THE CLICKER BUTTON */}
      <button 
        onClick={handleMine}
        className="relative group active:scale-95 transition-all duration-100"
      >
        <div className="absolute inset-0 bg-neutral-700 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
        <div className="relative w-48 h-48 bg-neutral-800 border-4 border-neutral-700 rounded-full flex items-center justify-center shadow-2xl overflow-hidden cursor-pointer hover:border-neutral-500 transition-colors">
          <span className="text-6xl select-none transform group-hover:scale-110 transition-transform">🪨</span>
        </div>
      </button>

      <div className="mt-16 flex gap-4">
        <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-600 text-sm select-none">
          Auto-Miner WIP 🔒
        </div>
        <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-600 text-sm select-none">
          Deep Caves WIP 🔒
        </div>
      </div>

    </motion.div>
  )
}

export default Mine
