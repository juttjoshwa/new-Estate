import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItems from "../Componets/ListingItems";

const Search = () => {
  const [searchBarData, setsearchBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loadingListing, setloadingListing] = useState(false);
  const [ListingData, setListingData] = useState([]);
  const [ShowMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const typeFormUrl = urlParams.get("type");
    const parkingFormUrl = urlParams.get("parking");
    const furnishedFormUrl = urlParams.get("furnished");
    const offerFormUrl = urlParams.get("order");
    const sortFormUrl = urlParams.get("sort");
    const orderFormUrl = urlParams.get("order");

    if (
      searchTermFormUrl ||
      typeFormUrl ||
      parkingFormUrl ||
      furnishedFormUrl ||
      offerFormUrl ||
      sortFormUrl ||
      orderFormUrl
    ) {
      setsearchBarData({
        searchTerm: searchTermFormUrl || "",
        type: typeFormUrl || "all",
        parking: parkingFormUrl === "true" ? true : false,
        furnished: furnishedFormUrl === "true" ? true : false,
        offer: offerFormUrl === "true" ? true : false,
        sort: sortFormUrl || "created_at",
        order: orderFormUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setloadingListing(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await axios.get(`listing/get?${searchQuery}`);
      const lsi = res.data.listings;
      if (lsi.length > 6) {
        setListingData(res.data.listings);
        setloadingListing(false);
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListingData(res.data.listings);

      setloadingListing(false);
    };

    fetchListing();
  }, [location.search]);

  const HandelChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setsearchBarData({ ...searchBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setsearchBarData({ ...searchBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setsearchBarData({
        ...searchBarData,
        [e.target.id]:
          e.target.checked || e.target.checked || e.target.checked === "true"
            ? true
            : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setsearchBarData({ ...searchBarData, sort, order });
    }
  };

  const HandelSubmitform = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchBarData.searchTerm);
    urlParams.set("type", searchBarData.type);
    urlParams.set("parking", searchBarData.parking);
    urlParams.set("furnished", searchBarData.furnished);
    urlParams.set("offer", searchBarData.offer);
    urlParams.set("sort", searchBarData.sort);
    urlParams.set("order", searchBarData.order);

    const searchQuery = urlParams.toString();

    return navigate(`/search?${searchQuery}`);
  };

  const ShowMoreListing = async () => {
    const NumberOfListing = ListingData.length;
    const startIndex = NumberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`listing/get?${searchQuery}`);
    const Data = res;
    if (Data.data.listings.length < 8) {
      setShowMore(false);
    }
    setListingData([...ListingData, ...Data.data.listings]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-4 sm:border-r-4 min-h-screen">
        <form onSubmit={HandelSubmitform} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap capitalize font-semibold">
              Search term :
            </label>
            <input
              type="text "
              id="searchTerm"
              onChange={HandelChange}
              value={searchBarData.searchTerm}
              placeholder="Search..."
              className="p-3 border rounded-lg w-full hover:shadow-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="capitalize font-semibold">Type :</label>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={HandelChange}
                checked={searchBarData.type === "all"}
                className="w-5"
              />
              <span>Rent & sell</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 capitalize"
                onChange={HandelChange}
                checked={searchBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                onChange={HandelChange}
                checked={searchBarData.type === "sale"}
                id="sale"
                className="w-5 capitalize"
              />

              <span>sell</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={HandelChange}
                checked={searchBarData.offer}
                className="w-5 capitalize"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className=" flex gap-2">
              <input
                onChange={HandelChange}
                checked={searchBarData.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />

              <span>Parking</span>
            </div>
            <div className=" flex gap-2">
              <input
                type="checkbox"
                onChange={HandelChange}
                checked={searchBarData.furnished}
                id="furnished"
                className="w-5 capitalize"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className=" flex items-center gap-2">
            <label className="capitalize font-semibold">sort: </label>
            <select
              onChange={HandelChange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-2 hover:shadow-lg"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Leatest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="border hover:opacity-90 rounded-lg   p-3 bg-slate-700 text-white font-semibold capitalize hover:shadow-xl"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b-2 p-3 text-slate-600 capitalize">
          listing result :
        </h1>
        <div className="p-7 flex gap-3 flex-wrap">
          {!loadingListing && ListingData.length === 0 && (
            <p className=" text-3xl text-red-700 user-select-none capitalize">
              No result found!
            </p>
          )}
          {loadingListing && (
            <p className="text-3xl text-slate-700  w-full text-center">
              {" "}
              Loading...
            </p>
          )}
          {!loadingListing &&
            ListingData &&
            ListingData.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}

          {ShowMore && (
            <button
              onClick={ShowMoreListing}
              className="text-green-700 hover:underline p-3 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
