import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import { Show } from '@clerk/react'

import Layout from './components/Layout/Layout.tsx'
import Mine from './pages/Mine.tsx'
import Home from './pages/Home.tsx'
import Marketplace from './pages/Marketplace.tsx'
import Blacksmith from './pages/Blacksmith.tsx'
import Login from './pages/Login.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={
        <>
          <Show when="signed-in">
            <Navigate to="/" replace />
          </Show>
          <Show when="signed-out">
            <Login />
          </Show>
        </>
      } />

      {/* PRIVATE ROUTES */}
      <Route path="/" element={
        <>
          <Show when="signed-in">
            <Layout />
          </Show>
          <Show when="signed-out">
            <Navigate to="/login" replace />
          </Show>
        </>
      }>
        <Route index element={<Home />} />
        <Route path="mine" element={<Mine />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="blacksmith" element={<Blacksmith />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
