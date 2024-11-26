const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/studyRoom");
}

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  preparation: {
    type: String,
    required: true,
  },
  seat_no: {
    type: Number,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
