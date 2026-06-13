const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, nex) => {
    const authheader = req.headers.authorization

    if (!authheader || !authheader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token Tidak ada" })
    }

    const token = authheader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, "SECRET_KEY")
        req.user = decoded
        nex()
    } catch (error) {
        return res.status(401).json({ message: " Token tidak valid" })
    }
}
module.exports = authMiddleware