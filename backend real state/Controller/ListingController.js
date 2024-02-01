import Listing from "../Models/ListingModel.js";

export const CreateListing = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    const listing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const DeleteListing = async (req, res) => {
  try {
    const List = await Listing.findById(req.params.id);
    if (!List) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    if (req.user.id !== List.userRef) {
      return res.status(401).json({
        success: false,
        message: "You can only delete your own listing",
      });
    }
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Listing has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const UpdateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({
        success: false,
        message: "You can only update your own listing",
      });
    }

    const UpdatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      UpdatedListing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};

export const getListing = async (req, res) => {                   
  try {
    const ID = req.params.id;

    if (!ID) {
      return res.status(404).json({
        success: false,
        message: "Id is required",
      });
    }

    const listing = await Listing.findById(ID);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "listing not found",
      });
    }

    return res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};

export const getmoreListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      type,
      furnished,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
    });
  }
};
