const express = require("express");
const route = express.Router({ mergeParams: true });
const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const isLoggedIn = require("../Middlewares/isLoggedIn"); //to check whether is user is logged in or not
const checkUnique = require("../Middlewares/checkUnique");

route.get("/admin", isLoggedIn, async (req, res) => {
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
});

route.get("/newstudent/:seat", isLoggedIn, async (req, res) => {
  let { seat } = req.params;
  res.render("admin/newstudent.ejs", { seat });
});

route.post("/newstudent", isLoggedIn, checkUnique, async (req, res, next) => {
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
      res.redirect("/admin");
    } catch (error) {
      console.log("error occured");
      console.log(error.errmsg);
      return res.redirect("/newstudent");
    }
  } catch (error) {
    next(error);
  }
});

//see students
route.get("/students", isLoggedIn, async (req, res, next) => {
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
    res.render("admin/students.ejs", { admin, length});
  } catch (error) {
    next(error);
  }
});

//See Student on the basis of seat no
route.get("/students/:seat", isLoggedIn, async (req, res, next) => {
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
});

//delete the student from Admin as well as from the Student

route.delete(
  "/admin/:adId/students/:studId",
  isLoggedIn,
  async (req, res, next) => {
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
  }
);

route.get("/admin/:adId/students/:studId/edit", isLoggedIn, async (req, res, next) => {
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
})

route.put("/admin/:adId/students/:studId", isLoggedIn, checkUnique, async (req, res, next) => {
  try {
    let { adId, studId } = req.params;
    //yahapar usko edit karana

  } catch (error) {

  }
})

route.get("/adminprofile", async (req, res, next) => {
  let admin = req.user;
  let adminId = admin._id;
  let adminData = await Admin.findById(adminId);
  res.render("admin/adminprofile.ejs", { adminData });
})

route.get("/adminprofile/edit", async (req, res, next) => {
  let admin = req.user;
  let adminId = admin._id;
  let adminData = await Admin.findById(adminId);
  res.render("admin/adminprofile.edit.ejs", { adminData });
})

//Update the admin profile 

route.put("/adminprofile/:id", async (req, res, next) => {
  let { id } = req.params;
  let admin = await Admin.findById(id);
  await Admin.findByIdAndUpdate(id, { ...req.body.admin });
  res.redirect("/adminprofile/edit");
})

//edit student
module.exports = route;
