const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      required: true,
    },
    hospitals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital"
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

const UserMod = mongoose.model("User", userSchema);

module.exports = UserMod;
