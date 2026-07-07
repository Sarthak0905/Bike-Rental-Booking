const User = require("../models/User");
const Bike = require("../models/Bike");
const Booking = require("../models/Booking");

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBikes,
      totalBookings,
      pendingBookings,
      paidRevenueResult,
      bookingStatusStats
    ] = await Promise.all([
      User.countDocuments(),
      Bike.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalPrice"
            }
          }
        }
      ]),

      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1
            }
          }
        }
      ])
    ]);

    const totalRevenue = paidRevenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBikes,
        totalBookings,
        pendingBookings,
        totalRevenue,
        bookingStatusStats
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") }
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers
};