const Mongoose = require("mongoose");

const fileSchema = new Mongoose.Schema({
  tg_unique_id: { type: String, unique: true },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["completed", "downloading", "failed", "pending", "removed"],
    default: "pending",
  },
  err: String,
});
module.exports = Mongoose.model("File", fileSchema);
