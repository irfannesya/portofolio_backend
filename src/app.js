const express = require("express")
const app = express()

app.use(express.json())

const orderRoutes = require("./routes/orderRoutes")
app.use("/order", orderRoutes)

module.exports = app