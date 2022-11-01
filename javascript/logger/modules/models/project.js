const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProjectSchema = new Schema({
  name: { type: String, required: true },
});
ProjectSchema.index({ name: "text" });
ProjectSchema.plugin(timestamps);
ProjectSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Project", ProjectSchema);
