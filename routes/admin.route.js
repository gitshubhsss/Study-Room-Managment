const express = require("express");
const route = express.Router({ mergeParams: true });
const Admin = require("../models/admin.model");
const Student = require("../models/student.model");
const isLoggedIn = require("../Middlewares/isLoggedIn"); //to check whether is user is logged in or not
const checkUnique = require("../Middlewares/checkUnique");
const verifyPayment = require("../Middlewares/verifyPayment");

const controller = require("../controller/adminController");

route.get("/admin", isLoggedIn, controller.goToAdminDashboard);

route.get("/newstudent/:seat", isLoggedIn, controller.renderAdmissionForm);

//verifyPayment we have to check whether he has verified the payment or notF
//verifyPayment just pass this middleware
route.post("/newstudent", isLoggedIn, checkUnique, controller.createAdmission);

//see students
route.get("/students", isLoggedIn, controller.getAllStudentsTable);

//See Student on the basis of seat no
route.get("/students/:seat", isLoggedIn, controller.viewStudent);
//delete the student from Admin as well as from the Student
route.delete(
  "/admin/:adId/students/:studId",
  isLoggedIn,
  controller.deleteStudent
);
route.get("/admin/:adId/students/:studId/edit", isLoggedIn, controller.getEditStudentForm)
route.put("/admin/:adId/students/:studId", isLoggedIn, checkUnique,controller.updateStudentInfo)
//get admin profile
route.get("/adminprofile", controller.getAdminProfile)
//get admin profile edit form
route.get("/adminprofile/edit", controller.getEditAdminProfileForm)
//Update the admin profile 
route.put("/adminprofile/:id", controller.editAdminProfile)

//edit student
module.exports = route;
