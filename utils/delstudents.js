const mongoose = require("mongoose");

let Admin = require("../models/admin.model");
let Student = require("../models/student.model");

deleteStudent = async () => {
  // let students = await Student.find({}, { _id: 1 });
  // let studentId=students.map((student)=>{
  //     return student._id;
  // });
  // let detetedstudent=await Student.deleteMany({});
  // console.log(detetedstudent);
  let result = await Admin.updateMany(
    {}, // Empty filter means all documents in the collection will be matched
    { $set: { students: [] } } // Set the students field to an empty array for all matched documents
  );
  console.log(result);
};

// deleteStudent();
