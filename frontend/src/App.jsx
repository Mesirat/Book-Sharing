import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="" element={<Home />} />
        {/* <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} /> */}
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}
export default App;
