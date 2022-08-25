const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.send("No valid token found");
    } else {
        jwt.verify(token, process.env.mySecretKey, (err, decoded) => {
            if (err) {
                res.status(401).json({auth: false, message: "Authentication has failed"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}