import mongoose from "mongoose";

const userScheme = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  avatar: String,
  tagline: String,
  password: String,
  date: {
    type: Date,
    default: Date.now,
  },
  name: String,
  loggedin: Boolean,
});
export default mongoose.model("User", userScheme);
