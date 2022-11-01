const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const LikeSchema = new Schema({
  episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
});
LikeSchema.plugin(timestamps);
LikeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Like", LikeSchema);
