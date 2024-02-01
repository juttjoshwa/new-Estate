import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItems from "../Componets/ListingItems";

const Home = () => {
  const [offerListing, setofferListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);
  const [rentListing, setrentListing] = useState([]);
  const [errorListing, seterrorListing] = useState(false);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        seterrorListing(false);
        const res = await axios.get(`listing/get?offer=true&limit=4`);
        const Data = res;
        setofferListing(Data.data.listings);
        fetchRentListing();
      } catch (error) {
        seterrorListing(true);
      }
    };
    const fetchRentListing = async () => {
      try {
        seterrorListing(false);
        const res = await axios.get(`listing/get?type=rent&limit=4`);
        const Data = res;
        setrentListing(Data.data.listings);
        fetchSaleListing();
      } catch (error) {
        seterrorListing(true);
      }
    };
    const fetchSaleListing = async () => {
      try {
        seterrorListing(false);
        const res = await axios.get(`listing/get?type=sale&limit=4`);
        const Data = res;
        setsaleListing(Data.data.listings);
      } catch (error) {
        seterrorListing(true);
      }
    };
    fetchOfferListing();
    return () => {};
  }, []);

  return (
    <div>
      {/* top */}
      <div className=" flex flex-col gap-6 user-select-none p-20 sm:p-28 px-3 mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next{" "}
          <span className="text-slate-500 capitalize">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Royal Estate is the best place to find your next perfect place to
          live. <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={`/search`}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started now...
        </Link>
      </div>
      {/* swiper */}

      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <img
                src={listing.imageUrl[0]}
                alt="image"
                className="h-[500px] w-full object-cover bg-no-repeat rounded-sm"
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing result offer , sale ,rent */}
      <div className="mx-auto max-w-6xl p-3 flex flex-col gap-8 flex-wrap my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to={`/search?offer=true`}
                className="text-blue-800 hover:underline text-sm my-1"
              >
                Show more offers...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing &&
                offerListing.map((listing) => (
                  <div key={listing._id} className="w-3/5">
                    <ListingItems listing={listing} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 flex-wrap my-10">
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 capitalize">
                Recent Offers on rent
              </h2>
              <Link
                to={`/search?type=rent`}
                className="text-blue-800 hover:underline text-sm my-1"
              >
                Show more...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing &&
                offerListing.map((listing) => (
                  <div key={listing._id} className="w-3/5">
                    <ListingItems listing={listing} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 flex-wrap my-10">
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to={`/search?type=sale`}
                className="text-blue-800 hover:underline text-sm my-1"
              >
                Show more offers...
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing &&
                offerListing.map((listing) => (
                  <div key={listing._id} className="w-3/5">
                    <ListingItems listing={listing} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
