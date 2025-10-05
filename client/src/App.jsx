import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { 
  createBrowserRouter, 
  Outlet,
  RouterProvider
} from 'react-router-dom'

  import { Home, Product, Products} from './pages/index.js';
  import { Navbar,Footer } from './components/index.js';

  const Layout =() => {
    return(
      <>
      <Navbar />
      <Outlet />
      <Footer />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path:"/",
    element:<Layout/>,
    children: [
      {
      path:"/",
    element:<Home/>
  },
   {
      path:"/products/:id",
    element:<Products/>
  },
   {
      path:"/product/:id",
    element:<Product/>
  },
    ]
  },
   
  ])


  
  const App = () => {
    return (
      <div>
         <RouterProvider router={router} ></RouterProvider>
      </div>
    )
  }
  
  export default App
