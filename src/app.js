const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const orderRoutes = require("./routes/orderRoutes")
app.use("/order", orderRoutes)

app.listen(this.prototype, () => {
    console.log(`server berjalan di port ${PORT}`);

})

module.exports = app