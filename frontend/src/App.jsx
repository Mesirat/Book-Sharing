import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/tailwind.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
  //  <Login/>
  <SignUp/>
  )
}

export default App
