const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const ViewSchema = new Schema({
  episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
});
ViewSchema.plugin(timestamps);
ViewSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("View", ViewSchema);
