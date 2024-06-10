const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { jwToken } = require("../helpers/token");
const { sendverifiedEmail } = require("../helpers/mailer");

exports.newUser = async (req, res) => {
  try {
    const { fName, lName, email, password, bMonth, bDay, bYear } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid Email Address",
      });
    }

    const checkMail = await Users.findOne({ email });

    if (checkMail) {
      return res.status(400).json({
        message: "Email Address Already Exist",
      });
    }

    if (!validateLength(fName, 3, 15)) {
      return res.status(400).json({
        message: "First Name Should be 3 to 15 Characters",
      });
    }
    if (!validateLength(lName, 3, 15)) {
      return res.status(400).json({
        message: "First Name Should be 3 to 15 Characters",
      });
    }
    if (!validateLength(password, 8, 40)) {
      return res.status(400).json({
        message: "Password Should be 8 to 40 Characters",
      });
    }

    //Bcrypt
    const crypted = await bcrypt.hash(password, 10);

    //Validate username

    let tempUsername = fName + lName;
    let finalUsername = await validateUsername(tempUsername.toLowerCase());

    const user = await new Users({
      fName,
      lName,
      username: finalUsername,
      email,
      password: crypted,
      bMonth,
      bDay,
      bYear,
    }).save();

    const emailToken = jwToken({ id: user._id.toString() }, "30m");

    const url = `${process.env.BASE_URL}/activate/${emailToken}`;
    sendverifiedEmail(user.email, user.fName, url);
    res.send(user);
  } catch (error) {
    res.status(404).json({
      message: "Can not create user",
    });
  }
};
