const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const checkUnique = async (req, res, next) => {
  console.log("check unique middleware called");

  let data = req.user;
  console.log("check unique midddleware printing the admin data");
  console.log(data);
  
  let studentsData = await Admin.findOne(
    { students: data.students },
    { students: 1, _id: 0 }
  );
  console.log("check unique midddleware studentData");
  console.log(studentsData);
  

  let emailseat = await Student.find(
    { _id: { $in: studentsData.students } },
    { seat_no: 1, email: 1, _id: 0 }
  );
  console.log("check unique midddleware emails and seats");
  console.log(emailseat);
  
  //extracting emails
  const emails = emailseat.map((student) => {
    return student.email;
  });
  console.log("check unique midddleware emails");
  console.log(emails);
  //extracting seats
  const seats = emailseat.map((student) => {
    return student.seat_no;
  });
  console.log("check unique midddleware seats");
  console.log(seats);
  
  const { seat_no, email } = req.body.student;
  console.log(seat_no);
  console.log(email);

  if (emails.includes(email) || seats.includes(seat_no)) {
    console.log("email and seat number must be unique");
    return res.redirect("/newstudent");
  } else {
    console.log("the next has been called");
    next();
  }
};

module.exports = checkUnique;
