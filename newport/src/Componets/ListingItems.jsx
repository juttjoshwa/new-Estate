import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItems = ({ listing }) => {
  const getPrice = () => {
    if (listing.offer) {
      return listing.discountedPrice?.toLocaleString("en-US") || "N/A";
    }
    return listing.regularPrice?.toLocaleString("en-US") || "N/A";
  };

  return (
    <div className="bg-white shadow-md user-select-none hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrl[0]}
          alt="Image"
          className=" h-[200px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-gray-600 text-sm truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm line-clamp-2">{listing.description}</p>
          <p>
            ${getPrice()}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedroom > 1
                ? `${listing.bedroom} Beds`
                : `${listing.bedroom} Bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bedroom > 1
                ? `${listing.bathroom} Baths`
                : `${listing.bathroom} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItems;
