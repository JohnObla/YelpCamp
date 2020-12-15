const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const reviewBody = req.body.review;
  reviewBody.author = req.user;
  const review = new Review(reviewBody);

  const campground = await Campground.findById(id);
  campground.reviews.push(review);

  await Promise.all([review.save(), campground.save()]);

  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Promise.all([
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }),
    Review.findByIdAndDelete(reviewId),
  ]);

  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
