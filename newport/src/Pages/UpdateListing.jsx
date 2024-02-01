import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
import axios from "axios";
import toast from "react-hot-toast";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const param = useParams();
  const navigate = useNavigate();
  const [files, setfiles] = useState([]);
  const [imageUploadError, setimageUploadError] = useState(false);
  const [UploadedImage, setUploadedImage] = useState(null);
  const [Uploading, setUploading] = useState(false);
  const [formerror, setformerror] = useState(false);
  const [formloading, setformloading] = useState(false);
  const [formData, setformData] = useState({
    imageUrl: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedroom: 1,
    bathroom: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    if (!currentUser || !currentUser.avatar) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const fetchData = async () => {
    const listingId = param.id;
    if (!listingId) {
      return toast.error("id is required");
    }
    axios
      .get(`listing/get/${listingId}`)
      .then((re) => {
        setformData(re.data.listing);
      })
      .catch((err) => {
        navigate("/");
      });
  };

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
      setUploading(true);
      setimageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setformData({
            ...formData,
            imageUrl: formData.imageUrl.concat(urls),
          });
          setimageUploadError(false);
          setUploading(false);
          setUploadedImage(urls);
        })
        .catch((err) => {
          setimageUploadError("Image upload failed (2 mb max per image)");
          toast.error("Something went wrong ❌F");
          setUploading(false);
        });
    } else {
      setimageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const HandleDeleteImage = (index) => {
    setformData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };

  const HandleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const HandleSubmit = async (e) => {
    setformloading(true);
    e.preventDefault();
    try {
      if (formData.imageUrl.length < 1) {
        setformerror(true);
        return toast.error("You must upload at least one image");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        setformerror(true);
        return toast.error("Discounted price must be lower than regular price");
      }
      setformerror(false);

      const res = await axios.post(`listing/update/${param.id}`, {
        ...formData,
        userRef: currentUser._id,
      });

      const Data = res;

      setformloading(false);

      return navigate(`/listing/${Data.data.UpdatedListing._id}`);
    } catch (error) {
      setformerror(error);
      setformloading(false);
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase ">
        Update a listing
      </h1>
      <form onSubmit={HandleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="border rounded-lg outline-none p-3"
            maxLength="52"
            required
            onChange={HandleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border rounded-lg outline-none p-3"
            required
            onChange={HandleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border rounded-lg p-3 outline-none"
            required
            onChange={HandleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={HandleChange}
                checked={formData.type === "sale"}
              />
              <span className="capitalize">sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={HandleChange}
                checked={formData.type === "rent"}
              />
              <span className="capitalize">rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={HandleChange}
                checked={formData.parking}
              />
              <span className="capitalize">parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={HandleChange}
                checked={formData.furnished}
              />
              <span className="capitalize">furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={HandleChange}
                checked={formData.offer}
              />
              <span className="capitalize">offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 ">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedroom"
                className="border p-3 border-gray-300 rounded-lg outline-none"
                min="1"
                max="20"
                required
                onChange={HandleChange}
                value={formData.bedroom}
              />
              <span className="capitalize">beds</span>
            </div>
            <div className="flex items-center gap-2 mx2 ">
              <input
                type="number"
                id="bathroom"
                className="border p-3 border-gray-300 rounded-lg outline-none"
                min="1"
                max="20"
                required
                onChange={HandleChange}
                value={formData.bathroom}
              />
              <span className="capitalize">baths</span>
            </div>
            <div className="flex items-center gap-2 mx-2">
              <input
                type="number"
                id="regularPrice"
                className="border p-3 border-gray-300 rounded-lg outline-none"
                required
                onChange={HandleChange}
                value={formData.regularPrice}
              />
              <p className="capitalize">
                regular price{formData.type === "rent" ? "($/ month)" : ""}
              </p>
            </div>
            {formData.offer && (
              <div className="flex mx-2 items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  className="border p-3 border-gray-300 rounded-lg outline-none"
                  required
                  onChange={HandleChange}
                  value={formData.discountedPrice}
                />
                <p className="capitalize">
                  discounted price{formData.type === "rent" ? "($/ month)" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <p className="font-semibold text-lg">
            Images:
            <span className="font-normal text-base text-gray-500 ml-1">
              The first image will be the cover (MAX 6)
            </span>
          </p>
          <div className="flex gap-3">
            <input
              onChange={(e) => setfiles(e.target.files)}
              className="p-3 border border-gray-700 rounded w-full"
              type="file"
              multiple
              id="images"
              accept="images/*"
            />
            {/* <input
              onChange={(e) => setfiles(e.target.files)}
              className="p-3 border border-gray-700 rounded w-full"
              type="file"
              multiple
              id="images"
              accept="images/*"
              value={formData.imageUrl} // This is the selected files array
              defaultValue={formData.imageUrl} // You don't need defaultValue here
            /> */}

            {/* Display the selected file names */}
            {/* <div className="mt-2">
              {formData.imageUrl &&
                formData.imageUrl.length > 0 &&
                formData.imageUrl.map((file, index) => (
                  <p key={index} className="text-gray-600">
                    {file.name}
                  </p>
                ))}
            </div> */}

            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-900 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-70"
            >
              {Uploading ? "Uploading...." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrl &&
            formData.imageUrl.length > 0 &&
            formData.imageUrl.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <img
                  src={url}
                  alt="image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => HandleDeleteImage(index)}
                  type="button"
                  className="text-red-700 p-3 rounded-lg border hover:opacity-70  hover:shadow-lg uppercase"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={formloading || Uploading}
            type="submit"
            className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-40"
          >
            Update listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
