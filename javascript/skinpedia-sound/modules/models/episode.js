const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const EpisodeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: String, default: "active" },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});
EpisodeSchema.index({ title: "text", description: "text" });
EpisodeSchema.plugin(timestamps);
EpisodeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Episode", EpisodeSchema);
