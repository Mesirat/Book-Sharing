import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
        <Route path="" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
