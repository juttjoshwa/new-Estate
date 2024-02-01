import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const HandelSubmit = (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searcTerm", searchTerm);
      const searchQurey = urlParams.toString();
      return navigate(`/search?${searchQurey}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const Urlparams = new URLSearchParams(location.search);
    const urlSearchTerm = Urlparams.get("searchTerm");
    if (urlSearchTerm) {
      setsearchTerm(urlSearchTerm);
    }

    return () => {};
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center mx-auto max-w-6xl p-3 ">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Royal</span>
            <span className="text-slate-700">EState</span>
          </h1>
        </Link>
        <form
          onSubmit={HandelSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600 hover:cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-3">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to={currentUser ? "/profile" : "/sign-in"}>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-7 object-cover"
              />
            ) : (
              <li className="text-slate-700 hover:underline cursor-pointer">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
