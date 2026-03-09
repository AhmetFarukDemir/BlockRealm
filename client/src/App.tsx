import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import Layout from './components/Layout/Layout.tsx'

{/* Pages */}
import Mine from './pages/Mine.tsx'
import Home from './pages/Home.tsx'
import Marketplace from './pages/Marketplace.tsx'
import Blacksmith from './pages/Blacksmith.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="mine" element={<Mine />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="blacksmith" element={<Blacksmith />} />
    </Route>
  )
);

function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
