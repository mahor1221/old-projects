const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const PlayListSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  episode: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
});
PlayListSchema.plugin(timestamps);
PlayListSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("PlayList", PlayListSchema);
