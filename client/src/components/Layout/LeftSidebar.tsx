import  InventoryItem  from './Inventory/InventoryItem.tsx'
import useGameStore from '../Store/useGameStore.ts'



const LeftSidebar = () => {
  const inventory = useGameStore((state) => state.inventory);

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
        {inventory.map ((item) => (
          <InventoryItem 
            key={item.id}
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            level={item.level}
            type={item.type}
            base_power={item.base_power}
            base_defense={item.base_defense}
            healing_amount={item.healing_amount}
            rarity={item.rarity}
            iconUrl={item.iconUrl}
            value={item.value}
          />
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar
