const signUpShcema = require("../Schema/signUpShema");
const ExpressError = require("../Middlewares/ExpressError");
const validateSignUp = (req, res, next) => {
    console.log("inside the validate Signup");
    let { error } = signUpShcema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}

module.exports = validateSignUp;