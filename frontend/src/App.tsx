import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Sender } from './pages/Sender'
import { Receiver } from './pages/Receiver'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sender' element={<Sender />}></Route>
        <Route path='/receiver' element={<Receiver />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
