import { StrictMode,useState } from 'react'
import './index.css'
import { 
  createBrowserRouter, 
  Outlet,
  RouterProvider
} from 'react-router-dom'

  import { Home, Product, Products, PasswordReset} from './pages/index.js';
  import { Navbar,Footer, Login, } from './components/index.js';
  import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  const Layout =() => {
  const [ showLogin, setShowLogin ] = useState(false);

    return(
      <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      "{showLogin ? <Login setShowLogin={setShowLogin}/> : <></>}
      <Navbar
       setShowLogin={setShowLogin}
        />
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
  //  {
  //     path:"Login",
  //   element:<Login/>
  // },
   {
      path:"/password-reset",
    element:<PasswordReset/>
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
