import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  placement: {
    type: String,
    required: true,
    enum: ["home-desktop", "home-mobile", "page-header", "winter-banner", "coupon-banner"],
    default: "home-desktop",
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    default: "",
  },
  linkUrl: {
    type: String,
    default: "",
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bannerSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
