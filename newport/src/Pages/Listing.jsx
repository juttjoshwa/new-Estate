import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide, SwiperSlider } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Link, useParams } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../Componets/Contact";

const Listing = () => {
  SwiperCore.use(Navigation);
  const [listingData, setlistingData] = useState(null);
  const [getlistingDataLoading, setgetlistingDataLoading] = useState(false);
  const [getlistingDataError, setgetlistingDataError] = useState(false);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const param = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const getPrice = () => {
    if (listingData.offer) {
      return listingData.discountedPrice?.toLocaleString("en-US") || "N/A";
    }
    return listingData.regularPrice?.toLocaleString("en-US") || "N/A";
  };

  const fetchlistingDataDate = async () => {
    setgetlistingDataLoading(true);
    const listingDataId = param.id;
    if (!listingDataId) {
      return toast.error("Id is required");
    }
    axios
      .get(`listing/get/${listingDataId}`)
      .then((re) => {
        setlistingData(re.data.listing);
        setgetlistingDataError(false);
        setgetlistingDataLoading(false);
      })
      .catch((er) => {
        setgetlistingDataError(true);
        setgetlistingDataLoading(false);
      });
  };
  useEffect(() => {
    fetchlistingDataDate();

    return () => {};
  }, [param.id]);


  return (
    <main>
      {getlistingDataLoading && (
        <p className="text-center text-3xl my-5 text-slate-700">Loading</p>
      )}
      {getlistingDataError && (
        <div className="flex flex-col items-center">
          <p className="text-center text-4xl text-red-800 my-5 select-none">
            Something went wrong ❌
          </p>
          <Link
            className="border p-3 rounded-lg font-semibold hover:shadow-lg bg-slate-200"
            to={"/"}
            type="button"
          >
            {" "}
            Back to home page ⬅️
          </Link>
        </div>
      )}
      {listingData && !getlistingDataError && !getlistingDataLoading && (
        <div>
          <Swiper navigation>
            {listingData.imageUrl.map((url, index) => (
              <SwiperSlide key={url}>
                {/* <div
                  className="h-[550px] bg-center bg-cover"
                  style={{ background:"url(im)" }}
                ></div> */}
                <img
                  src={url}
                  className="h-[450px] w-full object-cover bg-no-repeat rounded-sm"
                  alt="url"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listingData.name} - $ {listingData.offer && getPrice()}
              {listingData.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listingData.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listingData.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listingData.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listingData.regularPrice - +listingData.discountedPrice}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listingData.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listingData.bedroom > 1
                  ? `${listingData.bedroom} beds `
                  : `${listingData.bedroom} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listingData.bathroom > 1
                  ? `${listingData.bathroom} baths `
                  : `${listingData.bathroom} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listingData.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listingData.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listingData.userRef !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listingData} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
