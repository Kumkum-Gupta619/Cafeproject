const express = require('express');
//Kumkum gupta is my name 
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();
var auth = require('../services/authentication');

var checkRole = require('../services/checkRole');
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email, password , role, status from user where email =?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {

                query = "insert into  user (name , contactNumber, email, password , status,role) value (?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ messsage: "succefully registered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Email already exist" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email, password , role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or password" });
            }
            else if (results[0].status == 'false') {
                return res.status(401).json({ message: "Wait for Admin approval" });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again latter" });
            }
        }
        else {
            return res.status(500).json(err);
        }

    })

})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "SELECT email, password FROM user WHERE email = ?";

    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password send successfully to your email." })
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password by  cafe management system",
                    html: '<p><b>Your login details for cafe management System</b><br><b>Email:</b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href ="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }

                });

                return res.status(200).json({ message: "Password send successfully to your email." })

            }
        }

        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name , email, contactNumber, status from user where role = 'user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})



router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "Update user set status=? where id =?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User id does not exist" });
            }
            return res.status(200).json({ message: "User  updated successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})



// to check the token

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})


// to chenge the paword by  the user

router.post('/changePassword', auth.authenticateToken,(req, res) => {
    const user = req.body;
    const email = res.locals.email;
    var query = "select * from user where email=? and password =?";
    connection.query(query, [email, user.oldPassword], (err, result) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect old password" });
            }
            else if (results[0].password == user.oldPaword) {
                query = "update user set  password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ mesage: "Password updated successfully" })
                    }
                    else {
                        return res.status(500).json(err);

                    }

                })


            } else {
                return res.json(400).json({ message: "Something went wrong please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// what is the problem now?? 
// 


module.exports = router;
