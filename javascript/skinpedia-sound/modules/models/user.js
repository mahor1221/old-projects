const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const bcrypt = require("bcrypt");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, default: null },
  mobile: { type: String, default: null },
  password: { type: String, default: null },
  type: { type: String, default: "" },
  favoritesEpisode: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
});
//
UserSchema.plugin(timestamps);
UserSchema.plugin(aggregatePaginate);
UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});
//
module.exports = mongoose.model("User", UserSchema);
