const ExpressError = require("../Middlewares/ExpressError")
const LoginSchema = require("../Schema/LoginSchemal");

const validateLogin = (req, res, next) => {
    console.log("inside the validate login");
    let { error } = LoginSchema.validate(req.body);
    if (error) {
        req.flash("error", "cant login");
        return res.redirect("/login");
    } else {
        next();
    }
}

module.exports = validateLogin;