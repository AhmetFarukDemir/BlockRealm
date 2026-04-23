import InventoryItem  from './Inventory/InventoryItem.tsx'
import useGameStore from '../Store/useGameStore.ts'



const LeftSidebar = () => {
  const inventory = useGameStore((state) => state.inventory);
  const gameDictionary = useGameStore((state) => state.gameDictionary);

  if (!gameDictionary) return <div className="p-4 text-neutral-500">Loading Data...</div>;


  return (
    <div className='select-none'>
      <div className='flex bg-neutral-950 p-1 rounded-lg mb-6 mt-4'>
        <button 
            onClick={() => {}}
            className='flex-1 py-2 text-sm font-semibold rounded-md transition-all bg-neutral-800 text-white shadow'
          >
            Inventory
          </button>
      </div>

      <div className='space-y-2'>
        {inventory.map((item) => {
          // itemId from DB or id from zustand
          const targetId = item.itemId || item.id; 
          
          const dictItem = gameDictionary.items[targetId];

          if (!dictItem) return null; 

          // Render on-the-fly
          return (
            <InventoryItem 
              key={targetId}
              id={targetId}
              name={dictItem.name}               // From dictionary
              quantity={item.quantity}           // From DB
              type={dictItem.type}               // From dictionary
              rarity={'common'}                  // Hardcode rarity for now
              iconUrl={dictItem.iconUrl}         // From dictionary
              value={dictItem.value}             // From dictionary
              level={1}                          // Hardcode level for now
            />
          )
        })}
      </div>

    </div>
  )
}

export default LeftSidebar
