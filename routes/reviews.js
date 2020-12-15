const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { validateReview } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

// Routes
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
