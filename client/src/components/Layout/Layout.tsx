import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar.tsx'
import RightSidebar from './RightSidebar.tsx'
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
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
  )
}

export default Layout
