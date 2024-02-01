import { Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import SignUp from "./Pages/SignUp";
import Header from "./Componets/Header";
import PrivateRoute from "./Componets/PrivateRoute";
import CreateListing from "./Pages/CreateListing";
import Listing from "./Pages/Listing";
import UpdateListing from "./Pages/UpdateListing";
import Search from "./Pages/Search";

function App() {
  // axios.defaults.baseURL = "https://real-estate-backend-ruby.vercel.app/api/"; // Set the base URL for Axios requests
  axios.defaults.baseURL = "http://localhost:4000/api/"; // Set the base URL for Axios requests
  axios.defaults.withCredentials = true;
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:id" element={<UpdateListing />} />
        <Route path="/listing/:id" element={<Listing />} />
      </Routes>
    </div>
  );
}

export default App;
