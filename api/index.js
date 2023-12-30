const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.text());

mongoose
  .connect(
    "mongodb+srv://abhiiiitripathi:abhiabhiabhi@cluster0.ds8ge8g.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Conneted to MongoDB"))
  .catch((err) => console.log("Error", err.message));

app.listen(port, () => console.log("Server is running on Port 3000"));

const User = require("./models/user");
const Post = require("./models/post");

//Endpoint to register a user in the backend

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(201).json({ message: "Email already Registered" });
    }

    //Create a new User
    const newUser = new User({ name, email, password });

    //Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //Save the user to the database
    await newUser.save();

    //Send the verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message:
        "Registration Successful Please Check you email for verification",
    });
  } catch (error) {
    console.log("Error Registering User", error);
    res.status(500).json({ message: "Error Registering User" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abhiiii.tripathi@gmail.com",
      pass: "bwoc bski ephq srzb",
    },
  });

  //compose the mail message
  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `Please Click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error Sending Mail :", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(404).json({ message: "Invalid Token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified Successfully" });
  } catch (error) {
    console.log("Error Getting Token", error);
    res.status(500).json({ message: "Email verification Failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    if (password !== user.password) {
      return res.status(404).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//End point to access all the users except the logged in user

app.get("/users/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error : ", error);
        res.status(500).json({ message: "Error" });
      });
  } catch (error) {
    res.status(500).json({ message: "Error getting the users" });
  }
});

// End Point for Follow a particular user

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log("Error in Following : ", error);
    res.status(500).json({ message: "Error in Following :", error });
  }
});

// End point to unFollow a particular user

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });
    res.status(200).json({message:"Unfollowed Successfully"})
  } catch (error) {
    console.log("Error Unfollowing user", error);
    res.status(500).json({ message: "Error Unfollowing User" });
  }
});
