const Admin = require("../models/admin.model");
const Student = require("../models/student.model");

//go to admin page
module.exports.goToAdminDashboard = async (req, res) => {
  let data = req.user;
  let total_seats = data.seats;
  //find all the students in the databse
  const studentIds = data.students;
  const students = await Student.find({ _id: { $in: studentIds } }, "seat_no");
  const reserveSeats = students.map((student) => student.seat_no);
  const totalSeats = Array.from({ length: total_seats }, (_, i) => i + 1); //array from [1.....total_seats]
  const availableSeats = totalSeats.filter((seat_no) => {
    return !reserveSeats.includes(seat_no);
  });
  let admin = await Admin.findOne({ username: data.username })
    .populate("students")
    .exec();
  console.log(admin);
  res.render("admin/dashboard.ejs", {
    admin,
    reserveSeats,
    availableSeats,
    totalSeats,
  });
};

//render the admission form

module.exports.renderAdmissionForm = async (req, res) => {
  let { seat } = req.params;
  res.render("admin/newstudent.ejs", { seat });
}

//add new student 

module.exports.createAdmission = async (req, res, next) => {
  try {
    console.log("/newstudent has been called");
    let admin = req.user;
    //current user
    console.log(admin);
    let adData = await Admin.findOne({ username: admin.username });
    //curent user
    console.log("current admin");
    console.log(adData);
    console.log("req.body data");
    console.log(req.body.student);
    //before moving forward i wants to check whether the email and seat no is unique or not
    //then and then only will save the details otherwise will flash message that the user is already exists
    let student = new Student(req.body.student);
    //
    console.log("this is the student");

    console.log(student);
    //till here the code is working absolutely fine theire is not issue till here
    try {
      await student.save();
      adData.students.push(student);
      await adData.save();
      console.log(student);
      console.log(adData);
      req.flash("success", "new student added")
      res.redirect("/admin");
    } catch (error) {
      console.log("error occured");
      console.log(error.errmsg);
      return res.redirect("/newstudent");
    }
  } catch (error) {
    next(error);
  }
};

//get all students table

module.exports.getAllStudentsTable = async (req, res, next) => {
  try {
    let data = req.user;
    let admin = await Admin.findOne({ username: data.username })
      .populate("students")
      .exec();
    let length = admin.students.length;
    console.log(length);
    console.log("printing the lenght");
    admin.students.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    res.render("admin/students.ejs", { admin, length });
  } catch (error) {
    next(error);
  }
};

//view student 

module.exports.viewStudent = async (req, res, next) => {
  try {
    let admin = req.user;
    let adId = admin._id;

    let { seat } = req.params;
    let data = req.user; // Assuming req.user is populated and contains the students array
    let studentIds = data.students;

    // Find the student with a specific seat number within the user's students
    let student = await Student.find({
      _id: { $in: studentIds },
      seat_no: seat,
    });
    console.log(student);

    // Send the student data as a response (you can modify this based on your needs)
    res.render("admin/viewStudent.ejs", { student, adId });
  } catch (err) {
    // Handle errors gracefully
    next(err);
  }
};

//delete student 

module.exports.deleteStudent = async (req, res, next) => {
  try {
    let { adId, studId } = req.params;
    let result = await Admin.updateOne(
      { _id: adId },
      { $pull: { students: studId } }
    );
    let result2 = await Student.findByIdAndDelete(studId);
    console.log(result);
    console.log(result2);
    res.redirect("/students");
  } catch (error) {
    next(error);
  }
};

//get edit student form 

module.exports.getEditStudentForm = async (req, res, next) => {
  try {
    let { adId, studId } = req.params;
    let admin = await Admin.findById(adId);//got the admin id
    let student = await Student.findOne({ _id: studId });
    console.log('printing the student info');
    console.log(student);
    res.render("admin/editStudent.ejs", { student, adId });
  } catch (error) {
    res.send('error');
  }
};

//get admin profile 

module.exports.getAdminProfile = async (req, res, next) => {
  let admin = req.user;
  let adminId = admin._id;
  let adminData = await Admin.findById(adminId);
  res.render("admin/adminprofile.ejs", { adminData });
};

//get edit admin profile from 

module.exports.getEditAdminProfileForm = async (req, res, next) => {
  let admin = req.user;
  let adminId = admin._id;
  let adminData = await Admin.findById(adminId);
  res.render("admin/adminprofile.edit.ejs", { adminData });
}

module.exports.editAdminProfile = async (req, res, next) => {
  let { id } = req.params;
  let admin = await Admin.findById(id);
  await Admin.findByIdAndUpdate(id, { ...req.body.admin });
  res.redirect("/adminprofile");
};

module.exports.updateStudentInfo = async (req, res, next) => {

  try {
    const { adId, studId } = req.params;
    const { student } = req.body;
    // Find the admin by ID and ensure the student ID exists in the admin's students array
    const admin = await Admin.findById(adId).populate("students");//means we are converting to i t the array form
    console.log(admin);
    console.log("printing the adimin data");

    if (!admin) {
      return res.status(404).send("Admin not found");
    }
    // Check if the student exists in the admin's students array
    const studentExists = admin.students.some((stud) => stud._id.toString() === studId);
    if (!studentExists) {
      return res.status(404).send("Student not found in this admin's record");
    }
    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(studId, student, { new: true });

    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }
    const seatNo = updatedStudent.seat_no;
    res.redirect(`/students/${seatNo}`)
    // res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error(error);
    next(error);
  }

}