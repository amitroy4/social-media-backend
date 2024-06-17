const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { jwToken } = require("../helpers/token");
const { sendverifiedEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");

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

    const token = jwToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username,
      profilepicture: user.profilepicture,
      fName: user.fName,
      lName: user.lName,
      token: token,
      verified: user.verified,
      message: " Registration successful!, Please Verify your email for login.",
    });
  } catch (error) {
    res.status(404).json({
      message: "Can not create user",
    });
  }
};

exports.verifiedUser = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.SECRET_TOKEN);
    console.log(process.env.SECRET_TOKEN);
    const check = await Users.findById(user.id);
    if (check.verified === true) {
      return res.status(400).json({
        message: "This email is already verified.",
      });
    } else {
      await Users.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "Account has been Activated successfully.",
      });
      console.log("Here");
    }
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
