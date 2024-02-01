import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setlandlord] = useState(null);
  const [message, setmessage] = useState("");

  const fetchLandlordData = async () => {
    try {
      axios
        .get(`auth/${listing.userRef}`)
        .then((res) => {
        
          setlandlord(res.data.restof);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLandlordData();

    return () => {};
  }, [listing.userRef]);

  return (
    <div>
      {landlord && (
        <div className=" flex flex-col gap-2">
          <p className=" text-slate-700">
            Contact{" "}
            <span className="text-black font-semibold">{landlord.name}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            className="border-none outline-none rounded-lg w-full p-3 my-3"
            placeholder="Enter your message here..."
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
          >
            <button
              type="button"
              className="bg-slate-700 p-3 rounded-lg text-white fw-semibold uppercase hover:shadow-lg"
            >
              Send message
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
