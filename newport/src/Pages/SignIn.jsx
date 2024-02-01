import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import time from "../Asset/time.png";
import { useDispatch, useSelector } from "react-redux";
import {
  signinStart,
  signInSuccess,
  signInFailure,
} from "../redux/User/User.js";
import axios from "axios";
import OAuth from "../Componets/OAuth.js";

const SignIn = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const [email, setemail] = useState("");
  const [loading1, setloading] = useState(false);
  const { error } = useSelector((state) => state.user);
  const [password, setpassword] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      await axios
        .post("/auth/signin", {
          email: email,
          password: password,
        })
        .then((res) => {
          dispatch(signInSuccess(res.data.restof));
          setloading(false);
          setemail("");
          
          setpassword("");
          nevigate("/profile");
        })
        .catch((err) => {
          dispatch(signInFailure(err.response.data.message));
          setloading(false);
          
        });
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7 select-none">
        Sign in
      </h1>
      <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          required
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          required
          id="password"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
        <button
          disabled={loading1 ? true : false}
          type="submit"
          className={
            loading1
              ? "flex justify-center items-center bg-slate-700 text-white p-0 rounded-lg uppercase hover:opacity-90 disabled:opacity-60"
              : "flex justify-center items-center bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-60"
          }
        >
          {!loading1 ? (
            "Sign In"
          ) : (
            <img src={time} className="w-14 h-14 invert" alt="time" />
          )}
        </button>
        <OAuth />
      </form>
      <div className="flex my-3 gap-1">
        <p>Don't Have an account?</p>
        <span className="text-blue-700">
          <Link to="/sign-up">Sign Up</Link>
        </span>
      </div>
      {error === null ? (
        <p className="d-none"></p>
      ) : (
        <p className="text-red-700 py-4">{error}</p>
      )}
    </div>
  );
};

export default SignIn;
