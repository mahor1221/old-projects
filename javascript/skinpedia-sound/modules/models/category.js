const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const CategorySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, default: null },
});
CategorySchema.plugin(timestamps);
CategorySchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Category", CategorySchema);
