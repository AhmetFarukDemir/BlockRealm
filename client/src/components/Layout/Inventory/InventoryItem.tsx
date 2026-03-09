type InventoryItemProps = {
  id: number
  name: string
  quantity: number
  level: number
  type: string
  value?: number
  base_power?: number
  base_defense?: number
  healing_amount?: number
  rarity: string
  iconUrl: string
}

const rarityBorderColors: Record<string, string> = {
  common: 'border-neutral-500',
  uncommon: 'border-green-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-orange-500',
}


const InventoryItem = (props: InventoryItemProps) => {
  const dynamicBorderClass = rarityBorderColors[props.rarity] || rarityBorderColors.common;

  return (
    <div className={`flex items-center p-3 gap-4 bg-neutral-800 border ${dynamicBorderClass} rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer`}>
      <img className="w-12 h-12 bg-neutral-900 rounded-md p-1 object-contain" src={props.iconUrl} alt={props.name} />
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-neutral-100">{props.name}</h3>
        <p className="text-sm text-neutral-400">Quantity: {props.quantity}</p>
        { props.level >= 1 && <p className="text-xs text-neutral-500">Level: {props.level}</p> }
      </div>
    </div>
  )
}

export default InventoryItem
