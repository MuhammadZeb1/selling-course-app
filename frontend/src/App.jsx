import {Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import  { Toaster } from 'react-hot-toast';
function App() {
 
  return (
    <>
    <Routes>
     <Route path="/" element={<Home/>}/>
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/>
    </Routes>
     <Toaster />
    </>
  )
}

export default App
