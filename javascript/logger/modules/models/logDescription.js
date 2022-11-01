const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LogDescriptionSchema = new Schema({
  description: { type: String, required: true },
  status: { type: String, required: true },
  logId: { type: Schema.Types.ObjectId, ref: "Log" },
});

LogDescriptionSchema.index({ status: "text", description: "text" });
LogDescriptionSchema.plugin(timestamps);
LogDescriptionSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("LogDescription", LogDescriptionSchema);
