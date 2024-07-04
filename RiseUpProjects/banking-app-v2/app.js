require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

//60ca49777dcdb01f2457d512

//global vars

var userId, memberCode, showID;
var user_name,
  user_address,
  user_PIN,
  user_voter,
  user_adhar,
  user_dob,
  user_phone,
  user_email;
var loanUserName,
  loanUserAddress,
  loanUserPIN,
  loanUserVoter,
  loanUserAdhar,
  loanUserDob,
  loanUserPhone,
  loanUserEmail,
  loanUserPan;

//middlewares
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//dbconfig
const connection_url =
  "mongodb+srv://admin-dipjoy:dj080701@cluster0.e43id.mongodb.net/usersDB?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(connection_url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.log("failed to connect to mongodb", err);
  }
};

connectDB();

// mongoose.connect("mongodb+srv://Rana619:Rana@1702@cluster0.lzo1o.mongodb.net/toDoList",{ useUnifiedTopology: true , useNewUrlParser: true  });

//mongo "mongodb+srv://cluster0.e43id.mongodb.net/myFirstDatabase" --username admin-dipjoy

const userSchema = new mongoose.Schema({
  //initial member creation form
  AccNo: String,
  userName: String,
  fName: String,
  address: String,
  phone: Number,
  pin: Number,
  pan: String,
  voter: String,
  adhar: Number,
  email: String,
  dob: String,
  //from deposit entry form

  depositType: String,
  depositAmount: Number,
  depositTimePeriod: Number,
  maturityAmount: Number,
  totalDepositAmount: Number,
  nominiName: String,
  nominiRelationship: String,
  nominiAge: Number,
  nominiProof: String,
  maturityType: String,
  refNumber: String,

  //from loanEntry form
  monthlyIncome: Number,
  occupation: String,
  loanAmount: Number,
  creditScore: Number,
  sanctionAmountLoan: Number,
  loanPeriod: Number,
  loanType: String,
  loanColateral: String,
  colateralAmount: Number,
  installmentAmount: Number,
  loanPaymentType: String,

  //from emiEntry form
  loanApplicantName: String,
  branchName: String,
  loanAccountNumber: String,
  loanCategory: String,
  loanSubCategory: String,
  loanPlanCode: String,
  loanApprovedAmount: Number,
  loanTenure: Number,
  loanPaymentMode: String,
  noInstallments: Number,
  loanInterestAmount: Number,
  totalPayable: Number,
  loanEmiAmount: Number,
  loanProcessingCharge: Number,
  loanOtherCharges: Number,
  loanInterestRate: Number,
  loanInterestType: String,
  loanAdvisorName: String,
  city: String,
  state: String,
  loanNarration: String,
});

const User = mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  userName: String,
  passWord: String,
});

const secret = "ThisIsOurLittleSecret.";
adminSchema.plugin(encrypt, { secret: secret, encryptedFields: ["passWord"] });

const Admin = mongoose.model("Admin", adminSchema);

// const newAdmin = new Admin({
//   userName: "admin-dj",
//   passWord: "dj123",
// });

// newAdmin.save();

//home route
app.get("/", (req, res) => {
  res.render("home");
});

//success route
app.get("/success", (req, res) => {
  res.render("success", {
    showID: showID,
  });
  showID = "";
});

//login route
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/Tab", (req, res) => {
  const authenticate = async () => {
    await Admin.findOne({ userName: req.body.name }, (err, foundAdmin) => {
      if (err) {
        console.log(err);
        res.render("login");
      } else {
        if (foundAdmin) {
          if (foundAdmin.passWord === req.body.password) {
            res.render("Tab");
          } else {
            res.render("login");
          }
        } else {
          res.render("login");
        }
      }
    });
  };
  authenticate();
});

app.get("/Tab", (req, res) => {
  res.render("Tab");
});

//tab route
// app.post("/Tab", (req, res) => {
//   //parse usename and password

//   //redirect to the route
//   res.redirect("/Tab");
// });

//member route
app.get("/Tab/member", (req, res) => {
  res.render("register");
});

app.post("/memberRegister", (req, res) => {
  //find the total users
  // User.find((err, users) => {
  //   if (err) {
  //     console.log(err);
  //     res.redirect("/memberRegister");
  //   } else {
  //     // console.log(users.length);
  //     showID = "M00" + String(users.length + 1);
  //   }
  // });
  const add = async () => {
    try {
      await User.countDocuments((err, count) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(count);
          showID = "M00" + String(count + 1);
          // console.log(showID);
          const user = new User({
            AccNo: showID,
            userName: req.body.userName,
            fName: req.body.fName,
            address: req.body.address,
            phone: req.body.phone,
            pin: req.body.pin,
            pan: req.body.pan,
            voter: req.body.voter,
            adhar: req.body.adhar,
            email: req.body.email,
            dob: req.body.dob,
          });
          //not used async await,rather used .then
          User.insertMany(user)
            .then(function (docs) {
              // console.log(docs[0]._id);
              // showId = docs[0]._id;
              // console.log(showId);
              res.redirect("/success");
            })
            .catch(function (err) {
              console.log(err);
              res.render("failure");
            });
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect("/memberRegister");
    }
  };
  add();
});

//deposit route
app.get("/Tab/deposit", (req, res) => {
  res.render("deposit", {
    user_name: user_name,
    user_address: user_address,
    user_PIN: user_PIN,
    user_voter: user_voter,
    user_adhar: user_adhar,
    user_dob: user_dob,
    user_phone: user_phone,
    user_email: user_email,
  });
});

app.get("/Tab/report", (req, res) => {
  res.render("report", {
    showType: " ",
    Users: " ",
  });
});

app.post("/Tab/report/search", (req, res) => {
  const showAll = async () => {
    try {
      await User.find((err, users) => {
        if (err) {
          console.log(err);
          res.redirect("/Tab/report");
        } else {
          res.render("report", {
            showType: req.body.reportType,
            Users: users,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect("/Tab/report");
    }
  };
  showAll();
});

app.post("/search", (req, res) => {
  //autofill the auto_form by searching in the database
  userId = req.body.uniqueId;
  const fetchDetails = async () => {
    try {
      await User.findOne({ AccNo: userId }, (err, user) => {
        if (err) {
          res.redirect("/Tab/deposit");
        } else {
          if (user == null) {
            user_name = "";
            user_address = "";
            user_PIN = "";
            user_voter = "";
            user_adhar = "";
            user_email = "";
            user_dob = "";
            user_phone = "";
            res.redirect("/Tab/deposit");
          } else {
            user_name = user.userName;
            user_address = user.address;
            user_PIN = user.pin;
            user_voter = user.voter;
            user_adhar = user.adhar;
            user_email = user.email;
            user_dob = user.dob;
            user_phone = user.phone;
            // console.log(user);
            res.redirect("/Tab/deposit");
          }
        }
      });
    } catch (e) {
      console.log(e);
      res.redirect("/Tab/deposit");
    }
  };
  fetchDetails();
});

app.post("/Tab/deposit/save", (req, res) => {
  //save the new fields under the searched AccNo
  const saveDetails = async () => {
    try {
      await User.updateOne(
        { AccNo: userId },
        {
          depositType: req.body.depositType,
          depositAmount: req.body.depositAmount,
          depositTimePeriod: req.body.depositTimePeriod,
          maturityAmount: req.body.maturityAmount,
          totalDepositAmount: req.body.totalDepositAmount,
          nominiName: req.body.nominiName,
          nominiRelationship: req.body.nominiRelationship,
          nominiAge: req.body.nominiAge,
          nominiProof: req.body.nominiProof,
          maturityType: req.body.maturityType,
          refNumber: req.body.refNumber,
        },
        (err, docs) => {
          if (err) {
            res.render("failure");
          } else {
            userId = "";
            user_name = "";
            user_address = "";
            user_PIN = "";
            user_voter = "";
            user_adhar = "";
            user_dob = "";
            user_phone = "";
            user_email = "";
            showID = "";
            res.redirect("/success");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  saveDetails();
});

//loan route
app.get("/Tab/loan", (req, res) => {
  res.render("loan");
});

//loan entry route under loan route
app.get("/Tab/loan/NewLoanEntry", (req, res) => {
  res.render("loanEntry", {
    loanUserName: loanUserName,
    loanUserAddress: loanUserAddress,
    loanUserPIN: loanUserPIN,
    loanUserVoter: loanUserVoter,
    loanUserAdhar: loanUserAdhar,
    loanUserDob: loanUserDob,
    loanUserPhone: loanUserPhone,
    loanUserEmail: loanUserEmail,
    loanUserPan: loanUserPan,
  });
});

app.post("/NewLoanEntry/search", (req, res) => {
  memberCode = req.body.memberCode;
  const fetchDetails = async () => {
    await User.findOne({ AccNo: memberCode }, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/Tab/loan/NewLoanEntry");
      } else {
        if (user == null) {
          loanUserName = "";
          loanUserAddress = "";
          loanUserPIN = "";
          loanUserVoter = "";
          loanUserAdhar = "";
          loanUserEmail = "";
          loanUserDob = "";
          loanUserPhone = "";
          loanUserPan = "";
          res.redirect("/Tab/loan/NewLoanEntry");
        } else {
          loanUserName = user.userName;
          loanUserAddress = user.address;
          loanUserPIN = user.pin;
          loanUserVoter = user.voter;
          loanUserAdhar = user.adhar;
          loanUserEmail = user.email;
          loanUserDob = user.dob;
          loanUserPhone = user.phone;
          loanUserPan = user.pan;
          res.redirect("/Tab/loan/NewLoanEntry");
        }
      }
    });
  };
  fetchDetails();
});

app.post("/Tab/loan/NewLoanEntry/save", (req, res) => {
  const addLoanDetails = async () => {
    try {
      await User.updateOne(
        { AccNo: memberCode },
        {
          monthlyIncome: req.body.monthlyIncome,
          occupation: req.body.occupation,
          loanAmount: req.body.loanAmount,
          creditScore: req.body.creditScore,
          sanctionAmountLoan: req.body.sanctionAmountLoan,
          loanPeriod: req.body.loanPeriod,
          loanType: req.body.loanType,
          loanColateral: req.body.loanColateral,
          colateralAmount: req.body.colateralAmount,
          installmentAmount: req.body.installmentAmount,
          loanPaymentType: req.body.loanPaymentType,
        },
        (err, docs) => {
          if (err) {
            console.log(err);
            res.render("failure");
          } else {
            memberCode = "";
            monthlyIncome = "";
            occupation = "";
            loanAmount = "";
            creditScore = "";
            sanctionAmountLoan = "";
            loanPeriod = "";
            loanType = "";
            loanColateral = "";
            colateralAmount = "";
            installmentAmount = "";
            loanPaymentType = "";
            res.redirect("/success");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  addLoanDetails();
});

//emi entry route under loan route
app.get("/Tab/loan/EMIentry", (req, res) => {
  res.render("emiEntry");
});

app.post("/Tab/loan/EMIentry/save", (req, res) => {
  const saveDetails = async () => {
    try {
      await User.updateOne(
        { AccNo: req.body.memberID },
        {
          loanApplicantName: req.body.loanApplicantName,
          branchName: req.body.branchName,
          loanAccountNumber: req.body.loanAccountNumber,
          loanCategory: req.body.loanCategory,
          loanSubCategory: req.body.loanSubCategory,
          loanPlanCode: req.body.loanPlanCode,
          loanApprovedAmount: req.body.loanApprovedAmount,
          loanTenure: req.body.loanTenure,
          loanPaymentMode: req.body.loanPaymentType,
          noInstallments: req.body.noInstallments,
          loanInterestAmount: req.body.loanInterestAmount,
          totalPayable: req.body.totalPayable,
          loanEmiAmount: req.body.loanEmiAmount,
          loanProcessingCharge: req.body.loanProcessingCharge,
          loanOtherCharges: req.body.loanOtherCharges,
          loanInterestRate: req.body.loanInterestRate,
          loanInterestType: req.body.loanInterestType,
          loanAdvisorName: req.body.loanAdvisorName,
          city: req.body.city,
          state: req.body.state,
          loanNarration: req.body.loanNarration,
        },
        (err, docs) => {
          if (err) {
            console.log(err);
            res.render("failure");
          } else {
            res.redirect("/success");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  saveDetails();
});

//SearchMember route
app.get("/Tab/SearchMember", (req, res) => {
  res.render("SearchMember", {
    dataType: "",
    getUser: "",
  });
});

app.post("/Tab/SearchMember/search", (req, res) => {
  const searchResult = async () => {
    try {
      await User.findOne({ AccNo: req.body.memberCode }, (err, getUser) => {
        if (err) {
          console.log(err);
          res.redirect("/Tab/SearchMember");
        } else {
          if (getUser == null) {
            res.redirect("/Tab/SearchMember");
          } else {
            res.render("SearchMember", {
              dataType: req.body.reportType,
              getUser: getUser,
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
      res.redirect("/Tab/SearchMember/search");
    }
  };
  searchResult();
});

//port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3500;
}

app.listen(port, function () {
  console.log("server running on port 3500");
});
