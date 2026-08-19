const express = require("express");
const {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike
} = require("../controllers/bikeController");
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();
/**
 * @swagger
 * /bikes:
 *   get:
 *     summary: Get public bike list with search, filters, sorting, and pagination
 *     tags: [Bikes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bike list returned
 */
router.get("/", getBikes);
router.get("/:id", getBikeById);
/**
 * @swagger
 * /bikes:
 *   post:
 *     summary: Create a bike (admin only)
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - category
 *               - pricePerDay
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [bike, scooty]
 *               pricePerDay:
 *                 type: number
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Bike created
 *       403:
 *         description: Admin access required
 */
router.post(
  "/",
  protect,
  allowRoles("admin"),
  upload.array("images", 5),
  createBike
);
router.patch("/:id", protect, allowRoles("admin"), updateBike);
router.delete("/:id", protect, allowRoles("admin"), deleteBike);
module.exports = router;