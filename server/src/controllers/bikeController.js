const Bike = require("../models/Bike");
const { getredisClient } = require("../config/redis");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const clearBikeCache = require("../utils/clearBikeCache");
const createBike = async (req, res, next) => {
  try {
      const uploadedImages = [];

    for (const file of req.files || []) {
      const image = await uploadToCloudinary(
        file.buffer,
        "bike-rental/bikes"
      );

      uploadedImages.push(image);
    }
    const bike = await Bike.create({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      pricePerDay: Number(req.body.pricePerDay),
      location: req.body.location,
      description: req.body.description,
      images: uploadedImages
    });
    await clearBikeCache();
    res.status(201).json({
      success: true,
      bike
    });
  } catch (error) {
    next(error);
  }
};

const getBikes = async (req, res, next) => {
  try {
    const cacheKey = `bikes:${JSON.stringify(req.query)}`;
     const redisClient = getRedisClient();
    if (redisClient) {
    const cachedBikes = await redisClient.get(cacheKey);

    if (cachedBikes) {
      return res.status(200).json({
        ...JSON.parse(cachedBikes),
        fromCache: true
      });
    }
  }
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      isAvailable: true
    };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = new RegExp(location, "i");
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};

      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }


    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (currentPage - 1) * pageLimit;

    const [bikes, totalBikes] = await Promise.all([
      Bike.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageLimit),

      Bike.countDocuments(query)
    ]);
     const responseData = {
      success: true,
      page: currentPage,
      limit: pageLimit,
      totalBikes,
      totalPages: Math.ceil(totalBikes / pageLimit),
      bikes,
      fromCache: false
    };
    if (redisClient) {
     await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify(responseData)
    );
  }
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

const getBikeById = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found."
      });
    }

    res.status(200).json({
      success: true,
      bike
    });
  } catch (error) {
    next(error);
  }
};

const updateBike = async (req, res, next) => {
  try {
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
         returnDocument: 'after' ,
        runValidators: true
      }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found."
      });
    }
    await clearBikeCache();
    res.status(200).json({
      success: true,
      bike
    });
  } catch (error) {
    next(error);
  }
};

const deleteBike = async (req, res, next) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found."
      });
    }
    await clearBikeCache();
    res.status(200).json({
      success: true,
      message: "Bike deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike
};