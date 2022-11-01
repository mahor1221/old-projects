const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
});
AdminSchema.plugin(timestamps);
AdminSchema.plugin(mongoosePaginate);

AdminSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model("Admin", AdminSchema);
