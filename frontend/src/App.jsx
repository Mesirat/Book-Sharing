import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReadBook from "./pages/ReadBook";
import GroupChat from "./pages/GroupChat";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="laterRead" element={<ReadLater />} />
          <Route path="likedbook" element={<LikedBook />} />
          <Route path="history" element={<History />} />
          <Route path="readbook" element={<ReadBook />} />
          <Route path="profile" element={<Profile />} />
          <Route path="groupchat" element={<GroupChat />} />
          <Route path="contact" element={<Contact />} />
          <Route path="likedbook" element={<LikedBook />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
