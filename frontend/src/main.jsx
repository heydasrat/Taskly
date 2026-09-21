import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, Register, Home, Setting, VerifyEmail,ForgotPassword, VerifyOTP,ResetPassword,LandingPage,Privacy, Term, Help } from './Pages/index.js'
import { ProtectedRoutes, PublicRoutes, AuthRoutes } from './routes/index.js'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AuthRoutes />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
          { path: "verify-email", element: <VerifyEmail /> },
          { path: "request-password-reset", element: <ForgotPassword /> },
          { path: "verify-otp", element: <VerifyOTP /> },
          { path: "reset-password", element: <ResetPassword /> },
        ]
      },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/dashboard", element: <Home /> },
          { path: "/setting", element: <Setting /> }
        ]
      }, {
        element: <PublicRoutes />,
        children: [
          {
            path: "/",
            element: <LandingPage/>
          },
          {
            path:"/privacy",
            element:<Privacy/>
          },
          {
            path:"/terms",
            element:<Term/>
          },
          {
            path:"/help",
            element:<Help/>
          }
        ]
      },
      {
        path:"*",
        element:"Not Found"
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   
    <RouterProvider router={router} />
    
  </Provider>
)