import { useState } from 'react'
import useGameStore from '../Store/useGameStore'
import { SignOutButton } from '@clerk/react'


const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')

  const player = useGameStore((state) => state.player)
  const xpPercentage = Math.min((player.experience / player.nextLevelExp) * 100, 100)
  const hpPercentage = Math.min((player.health / player.maxHp) * 100, 100)

  return (
    <div className="flex flex-col h-full bg-neutral-900 p-4">
      
      {/* TABS */}
      <div className="flex bg-neutral-950 p-1 rounded-lg mb-6">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'profile' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'settings' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          Settings
        </button>
      </div>

      {/* PROFILE CONTENT */}
      {activeTab === 'profile' ? (
        <div className="flex flex-col gap-6">
          
          {/* Player Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-800 border-2 border-neutral-700 rounded-lg flex items-center justify-center text-2xl select-none">
              <img src="icons/player.png" alt="Player Icon" width="42" /> 
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-100">{player.name}</h2>
              <p className="text-sm text-neutral-400 select-none">{player.title}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 select-none">
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Level</p>
              <p className="text-lg font-bold text-white">{player.level}</p>
            </div>
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Gold</p>
              <p className="text-lg font-bold text-yellow-500">{player.gold} 🪙</p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex flex-col gap-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800 select-none">
            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-bold">Health</span>
                <span className="text-neutral-400">{player.health} / {player.maxHp}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-300" 
                  style={{ width: `${hpPercentage}%` }} 
                />
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400 font-bold">Experience</span>
                <span className="text-neutral-400">{player.experience} / {player.nextLevelExp}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${xpPercentage}%` }} 
                />
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
            <h3 className="text-neutral-300 font-bold mb-4 border-b border-neutral-800 pb-2">Account Settings</h3>
            
            {/* CLERK SIGN OUT BUTTON */}
            <SignOutButton>
              <button className="w-full py-2.5 bg-red-900/10 hover:bg-red-900/30 text-red-500 hover:text-red-400 border border-red-900/50 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(220,38,38,0.05)] active:scale-95">
                <span>🚪</span> Log Out
              </button>
            </SignOutButton>

          </div>
        </div>
      )}

    </div>
  )
}

export default RightSidebar
