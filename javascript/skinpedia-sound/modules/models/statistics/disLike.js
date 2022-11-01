const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const DisLikeSchema = new Schema({
  episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
});
DisLikeSchema.plugin(timestamps);
DisLikeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("DisLike", DisLikeSchema);
