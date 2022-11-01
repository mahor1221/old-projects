const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LogSchema = new Schema({
  ip: { type: String, required: true },
  data: { type: String, required: true },
  logcode: { type: String, default: null },
  sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
});
LogSchema.index({ data: "text", ip: "text" });
LogSchema.plugin(timestamps);
LogSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Log", LogSchema);
