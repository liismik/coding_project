const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const postmark = require("postmark")
const fs = require("fs")
const path = require("path")
const Handlebars = require("handlebars")
const client = new postmark.ServerClient("fd6205c9-41c4-41ae-b4d7-8245db00d1d8")
const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.send("No valid token found");
    } else {
        jwt.verify(token, process.env.mySecretKey, (err, decoded) => {
            if (err) {
                res.status(400).json({auth: false, message: "Authentication has failed"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

async function sendEmail(emailValues, fileName, email, subject) {
    const source = fs.readFileSync(path.join(__dirname, "..", "emailTemplates", fileName), "utf8");
    const template = Handlebars.compile(source);
    const html = template(emailValues);

    await client.sendEmail({
        "From": "lmikola@tlu.ee",
        "To": email,
        "Subject": subject,
        "HtmlBody": html,
        "TextBody": "Hello from Postmark!",
        "MessageStream": "outbound"
    });
}

function paginate(resultsPerPage, currentPageNumber, paginatableData, state) {
    let totalPages = 0;

    const startingIndex = (currentPageNumber-1)*resultsPerPage;
    const lastIndex = startingIndex+resultsPerPage;

    let paginatedData;

    if(paginatableData.length < lastIndex) {
        paginatedData = paginatableData.slice(startingIndex, paginatableData.length);
    } else {
        paginatedData = paginatableData.slice(startingIndex, lastIndex);
    }
    let returnValues;

    if (state === "initial") {
        totalPages = Math.ceil(paginatableData.length/resultsPerPage);
        returnValues = {
            totalPages: totalPages,
            paginatedData: paginatedData
        }
    } else {
        returnValues = {
            paginatedData: paginatedData
        }
    }
    return (returnValues);
}

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const accountExists = await User.findOne(
        { "email": email }
    )

    if (accountExists)
        return res.status(400).json({ message: "User already exists!" });

    const emailRegex = /^[-!#$%&'*+\/\d=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/\d=?A-Z^_a-z`{|}~])*@[a-zA-Z\d](-*\.?[a-zA-Z\d])*\.[a-zA-Z](-?[a-zA-Z\d])+$/;

    if (!email)
        return res.status(400).json({ message: "Input is not an email!" });

    if (email.length > 254)
        return res.status(400).json({ message: "Email is too long!" });

    const valid = emailRegex.test(email)
    if (!valid)
        return res.status(400).json({ message: "The email format is not correct!" });

    const parts = email.split('@');
    if(parts[0].length>64)
        return res.status(400).json({ message: "First half of email is too long!" });

    const domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return res.status(400).json({ message: "Email domain length is too long!" });

    if(!password || (password.length < 8))
        return res.status(400).json({ message: "Password is too short! Must be more 8 or more characters long." });


    const hashedPassword = await bcrypt.hash(password, 10)


    const registeredUser = new User({
        email: email,
        password: hashedPassword,
        verified: false,
    })
    registeredUser.save()
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.json(error)
        })

    const emailValidationLink = "http://localhost:3000/confirm-account"; //TODO replace with accurate link after deployment
    const emailValues = { emailValidationLink:  emailValidationLink };

    try {
        await sendEmail(emailValues, "registered.hbs", email, "Successful registration to the coding_project!");
    } catch {
        res.status(200).json({ message: "Your account has been successfully registered, but no confirmation email was sent out. You can still verify your account at http://localhost:3000/confirm-account"}); //TODO replace link after deployment with correct link
    }

    return res.status(200);
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne(
        { "email": email }
    )

    if (!user)
        return res.status(400).json({ message:"A user with that email does not exist!" });

    try {
        if ((await bcrypt.compare(password, user.password)) && user.verified) {
            const timestamp = new Date().getTime();

            const userId = user._id;
            const token = jwt.sign({userId}, process.env.mySecretKey, {
                expiresIn: 3000,
            })

            await User.updateOne({ "email": email }, { $push: { "loginHistory": timestamp } })

            res.status(200).json({ auth: true, token: token, message: "Successfully logged in!" })
        } else if (!user.verified) {
            return res.status(400).json({ auth: false, message: "Please check your email and verify your account first!" });
        } else {
            return res.status(400).json({ auth: false, message: "Login failed!" });
        }
    } catch {
        res.status(400).json( { message: "Something went wrong..." });
    }
})

router.post("/confirm-account", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne(
        { "email": email }
    )

    if (!user)
        return res.status(400).json({ message: "A user with that email does not exist!" });

    try {
        if (await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: "Account successfully confirmed!" });

            await User.updateOne({ "email": email }, { "verified": true });
        } else {
            return res.status(400).json({ message: "Confirmation failed!" });
        }
    } catch {
        res.status(400).json({ message: "Something went wrong..." });
    }
})

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const newPassword = Math.random().toString(36).slice(-12);

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await User.findOneAndUpdate(
        {"email": email},
        {"password": hashedPassword}
    )

    const emailValues = { newPassword: newPassword };
    await sendEmail(emailValues, "password-reset.hbs", email, "Password reset");

    return res.status(200).json({ message: "Email containing new password successfully sent!" });
})

router.post("/users/paginated", verifyJWT, async (req, res) => {
    const { resultsPerPage, currentPageNumber, state } = req.body.params;

    const users = (await User.find({}, { "email": 1, "verified": 1 })).reverse();

    const returnedValues = paginate(resultsPerPage, currentPageNumber, users, state);
    res.json(returnedValues);
})

router.get("/users/:id", verifyJWT, async (req, res) => {
    const user = await User.findById(req.params.id);

    let readableDateTimes = [];
    user.loginHistory.forEach((timestamp) => {
        readableDateTimes.push(new Date(timestamp).toString());
    })

    res.json(readableDateTimes);
})

router.post("/users/delete-user", verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const email = req.body.currentUserEmail;

        await sendEmail({ email: user.email }, "account-deletion.hbs", user.email, "Account deletion");*/

        await User.deleteOne({_id: req.body.userId});

        if(user.email === email) {
            return res.status(200).json({ deletedOwnAccount: true, message: "User successfully deleted!" });
        }
        return res.status(200).json({ message: "User successfully deleted!" });
    } catch {
        return res.status(400).json({ message: "Error while deleting user!" });
    }

})

router.post("/users/:id/history/paginated", verifyJWT, async (req, res) => {
    const user = await User.findById(req.params.id);
    const loginHistory = user.loginHistory.reverse();
    const { resultsPerPage, currentPageNumber, state } = req.body.params;

    const returnedValues = paginate(resultsPerPage, currentPageNumber, loginHistory, state);

    res.json(returnedValues);
})

module.exports = router