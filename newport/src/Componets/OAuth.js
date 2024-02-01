import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../Firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/User/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OAuth = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();

  const HandleClickGoogle = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, Provider);
      const res = await axios.post("/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      dispatch(signInSuccess(res.data.restof));
      nevigate("/sign-in");
    } catch (error) {
      toast("Cloud not continue with google");
    }
  };

  return (
    <button
      type="button"
      onClick={HandleClickGoogle}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
    >
      continue with google
    </button>
  );
};

export default OAuth;
