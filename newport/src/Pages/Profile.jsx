import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../Firebase.js";
import time from "../Asset/time.png";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import User, {
  UpdateUserStart,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  SignOutUserStart,
  SignOutUserFailure,
  SignOutUserSuccess,
} from "../redux/User/User.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [fileUplaoderror, setfileUplaoderror] = useState(false);
  const [filepre, setfilepre] = useState(0);
  const [formDate, setformDate] = useState({});
  const [loadingDelete, setloadingDelete] = useState(false);
  const [errorDeleteUser, seterrorDeleteUser] = useState(null);
  const [error1, seterror1] = useState("");
  const [ShowListingError, setShowListingError] = useState(false);
  const [ShowListingLoading, setShowListingLoading] = useState(false);
  const [ShowDeleteLoading, setShowDeleteLoading] = useState(false);
  const [UserListingData, setUserListingData] = useState(null);
  const [UpdatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [loadingProfile, setloadingProfile] = useState(false);
  const Fileref = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // ! Move the navigation function outside the component

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setformDate({ ...formDate, [e.target.id]: e.target.value });
  };

  const HandleDelete = async (e) => {
    setloadingDelete(true);
    e.preventDefault();
    try {
      dispatch(DeleteUserStart());
      const res = await axios
        .delete(`auth/delete/${currentUser._id}`)
        .then((res) => {
          dispatch(DeleteUserSuccess(res.data.message));
          navigate("/");
        })
        .catch((err) => {
          toast.error("❌");
          console.log(err);
        });
      const data = res;
    } catch (error) {
      dispatch(DeleteUserFailure(error.payload.data));

      // seterrorDeleteUser(error.response);
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadtask = uploadBytesResumable(storageRef, file);

    uploadtask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setfilepre(Math.round(progress));

      uploadtask.catch((error) => {
        setfileUplaoderror(true);
      });

      uploadtask.then(() => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadUrl) =>
          setformDate({ ...formDate, avatar: downloadUrl })
        );
      });
    });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const OnSubmit = async (e) => {
    setloadingProfile(true);
    e.preventDefault();
    try {
      dispatch(UpdateUserStart());
      const res = await axios.post(`auth/update/${currentUser._id}`, formDate);

      const data = res;
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));

        setloadingProfile(false);
        return;
      }
      dispatch(UpdateUserSuccess(data.data.restof));
      setloadingProfile(false);
      setUpdatedSuccessfully(true);
    } catch (error) {
      dispatch(UpdateUserFailure(error.response.data.message));
      seterror1(error.response.data.message);
      setUpdatedSuccessfully(false);
      setloadingProfile(false);
    }
  };

  const HandleSignOut = async () => {
    try {
      dispatch(SignOutUserStart());
      const res = await axios.get(`auth/signout/${currentUser._id}`);
      const Data = res;

      if (Data.response.data.success === false) {
        dispatch(SignOutUserFailure(Data.response.data));
        return;
      }
      dispatch(SignOutUserSuccess(Data));
      navigate("/");
    } catch (error) {
      dispatch(SignOutUserFailure(error.data));
      return navigate("/");
    }
  };

  const HandleShowListing = async () => {
    try {
      setShowListingLoading(true);
      if (!currentUser._id) {
        setShowListingLoading(false);
        return toast.error("Please Login first");
      }
      setShowListingError(false);
      const res = await axios.get(`auth/listing/${currentUser._id}`);

      const data = res;
      setUserListingData(data.data.listing);
      setShowListingLoading(false);
    } catch (error) {
      setShowListingError(true);
      setShowListingLoading(false);
    }
  };

  const HandleUserDeleteListing = async (Listing_id) => {
    setShowDeleteLoading(true);
    try {
      const res = await axios.delete(`listing/delete/${Listing_id}`);
      const data = res;
      toast.success("Listing deleted successfully 👍");
      HandleShowListing();
      return setShowDeleteLoading(false);
    } catch (error) {
      toast.error("Something went wrong ❌");
      setShowDeleteLoading(false);

      return;
    }
  };

  return (
    <div className="p-1 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={OnSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => {
            setfile(e.target.files[0]);
          }}
          type="file"
          hidden
          accept="image/*"
          ref={Fileref}
        />
        {currentUser && currentUser.avatar && (
          <img
            src={formDate.avatar || currentUser.avatar}
            id="name"
            onClick={() => {
              Fileref.current.click();
            }}
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            alt="Profile"
          />
        )}
        <p className="text-sm self-center">
          {fileUplaoderror ? (
            <span className="text-red-700">
              Error image upload(image must be less than 2MB)
            </span>
          ) : filepre > 0 && filepre < 100 ? (
            <span className="text-slate-700">{`Uploading ${filepre}%`}</span>
          ) : filepre === 100 ? (
            <span className="text-green-700 capitalize">
              Successfully uploaded
            </span>
          ) : (
            ""
          )}
        </p>
        {currentUser && currentUser.name && (
          <input
            type="text"
            id="name"
            defaultValue={currentUser.name}
            placeholder="username"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
        )}
        {currentUser && currentUser.email && (
          <input
            id="email"
            type="text"
            defaultValue={currentUser.email}
            placeholder="Email"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="password"
        />
        <button
          type="submit"
          disabled={loadingProfile}
          className="flex justify-center align-items-center bg-slate-700 text-white rounded-lg p-3 uppercase  hover:opacity-80 disabled:opacity-80"
        >
          {!loadingProfile ? (
            "Update"
          ) : (
            <img src={time} className="w-7 h-7 invert" alt="time" />
          )}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-3">
        <span
          onClick={HandleDelete}
          className="text-rose-700 cursor-pointer capitalize"
        >
          Delete account
        </span>
        <span
          onClick={HandleSignOut}
          className="text-red-700 cursor-pointer capitalize"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-2">{error1}</p>
      <p className="text-green-600 mt-2">
        {UpdatedSuccessfully ? "User is updated successfully 👍" : ""}
      </p>
      <button
        type="button"
        onClick={HandleShowListing}
        className="text-green-700 w-full"
      >
        {ShowListingLoading ? "Loading" : " Show listing"}
      </button>
      <p className="text-red-700 text-center mt-4 capitalize">
        {ShowListingError ? "Error showing listing" : ""}
      </p>
      {UserListingData && UserListingData.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-slate-700 text-3xl font-semibold">
            Your listings
          </h1>
          {UserListingData.map((listing, index) => (
            <div
              className="flex p-3 border justify-between items-center rounded-sm gap-4"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w-18 object-contain  rounded-sm"
                  src={listing.imageUrl[0]}
                  alt="Listing image"
                />
              </Link>
              <Link to={`/listing/${listing._id}`}>
                <p className="text-slate-700 font-semibold">{listing.name}</p>
              </Link>
              <div className="flex gap-3 flex-col items-center">
                <button
                  onClick={() => HandleUserDeleteListing(listing._id)}
                  className="text-red-700 caption-bottom capitalize"
                >
                  {ShowDeleteLoading ? "Loading" : "Delete"}
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-slate-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
