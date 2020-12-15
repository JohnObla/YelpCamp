const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campgroundBody = req.body.campground;
  campgroundBody.author = req.user._id;

  const campground = new Campground(campgroundBody);

  await campground.save();

  req.flash("success", "Successfully made a new campground!");
  res.redirect(`campgrounds/${campground.id}`);
};

module.exports.campgroundDetails = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/details", campground);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render("campgrounds/edit", campground);
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;

  await Campground.findByIdAndUpdate(id, req.body.campground, {
    runValidators: true,
    useFindAndModify: false,
  });

  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.renderDeleteForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render("campgrounds/delete", campground);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
