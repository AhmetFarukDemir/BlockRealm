import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import axios from 'axios';
import LeftSidebar from './LeftSidebar.tsx';
import RightSidebar from './RightSidebar.tsx';
import { AnimatePresence } from 'framer-motion';
import useGameStore from '../Store/useGameStore';

const Layout = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const setUserData = useGameStore((state) => state.setUserData);
  const setGameDictionary = useGameStore((state) => state.setGameDictionary);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect( () => {
    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken(); 
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/me`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Hydration Failed:", error);
      } finally {
        setIsHydrating(false);
      }
    };

    
    const fetchGameDictionary = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/config`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setGameDictionary(response.data);
      } catch (error) {
        console.error("Error fetching game dictionary:", error);
      }
    };

    fetchGameDictionary();
    fetchUserData();
  }, [isLoaded, isSignedIn, getToken, setUserData, setGameDictionary]);

  // Show loading screen while hydrating user data
  if (isHydrating) {
    return (
      <div className="flex h-screen w-full bg-neutral-950 items-center justify-center">
        <div className="text-orange-500 font-bold text-xl animate-pulse">
          Loading the Realm... 🌍
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-screen w-full bg-neutral-950 text-neutral-200 overflow-hidden'>
      <div className='w-92 border-r border-neutral-800 bg-neutral-900'>
        <LeftSidebar />
      </div>

      <div className='flex-1 overflow-y-auto relative'>
        <AnimatePresence mode='wait'>
          <Outlet />
        </AnimatePresence>
      </div>
        
      <div className='w-92 border-l border-neutral-800 bg-neutral-900'>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
