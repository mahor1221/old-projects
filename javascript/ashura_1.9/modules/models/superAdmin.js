const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const bcrypt = require("bcrypt");

const superAdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
});
superAdminSchema.plugin(timestamps);

superAdminSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});
module.exports = mongoose.model("SuperAdmin", superAdminSchema);
