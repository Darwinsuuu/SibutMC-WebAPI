const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized User",
            error: error
        })
    }
}

module.exports = {
    checkAuth: checkAuth
}