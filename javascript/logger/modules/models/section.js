const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SectionSchema = new Schema({
  name: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
});
SectionSchema.index({ name: "text" });
SectionSchema.plugin(timestamps);
SectionSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Section", SectionSchema);
