const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/studyRoom");
}
const Student = require("./student.model");
const passportLocalMongoose = require("passport-local-mongoose");
const adminShema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
    },
  ],
});

adminShema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminShema);
module.exports = Admin;
