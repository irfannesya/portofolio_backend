const express = require("express")
const app = express()
const prisma = require("./db")
const port = process.env.PORT || 3000
const bcrypt = require("bcrypt")
const { data } = require("autoprefixer")
const { use } = require("react")
const { token } = require("morgan")
const authMiddleware = require("./src/middleware/auth")
const jwt = require("jsonwebtoken")

app.use(express.json())


app.get("/products", async (req, res) => {
    const products = await prisma.product.findMany()
    res.json(products)
})

app.post("/products", async (req, res) => {
    const { name, harga } = req.body || {}

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "nama wajib di isi" })
    }
    if (typeof harga !== "number") {
        return res.status(400).json({ message: " harga harus angka" })
    }

    try {
        const newProduct = await prisma.product.create({
            data: { name, harga }
        })
        res.json(newProduct)
    } catch (error) {
        res.status(500).json({ message: "gagal menyimpan data" })
    }

})




app.put("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const { name, harga } = req.body


    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "nama wajib di isi" })
    }

    if (typeof harga !== "number" || harga <= 0) {
        return res.status(404).json({ message: "harga harus > 0" })

    }

    try {
        const update = await prisma.product.update({
            where: { id },
            data: { name, harga }
        })
        res.json(update)
    } catch (error) {
        res.status(404).json({ message: "Produk tidak ditemukan" })
    }
})


app.delete("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await prisma.product.delete({
            where: { id }
        })

        res.json({ message: "Produk berhasil dihapus" })
    } catch (error) {
        res.status(404).json({ message: "Produk tidak ditemukan" })

    }
})

app.post("/register", async (req, res) => {
    console.log("BODY:", req.body);

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib di isi" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        res.json({
            message: "User Berhasil dibuat"
        })

    } catch (error) {

        if (error.code === "P2002") {
            return res.status(400).json({ message: "Email sudah digunakan" })
        }
        res.status(500).json({ message: "Terjadi error", error })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({ message: "Password salah" })
    }

    const token = jwt.sign({
        id: user.id, email: user.email
    },
        "SECRET_KEY",
        { expiresIn: "1h" })

    res.json({
        message: "Login Berhasil",
        token: token
    })
})
app.get("/profile", authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    })

    res.json({
        message: "Profile Berhasil diambil",
        data: {
            id: user.id,
            email: user.email
        }
    })
})

app.delete("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await prisma.user.delete({
            where: { id }
        })

        res.json({ message: "Produk berhasil dihapus" })
    } catch (error) {
        res.status(404).json({ message: "user tidak ditemukan" })

    }
})


app.post("/order", authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body

    const order = await prisma.order.create({
        data: {
            userId: req.user.id,
            productId,
            quantity
        }
    })

    res.json({
        message: "Order berhasil dibuat",
        data: order
    })
})


app.get("/order", (req, res) => {
    const order = [
        { id: 1, productId: 1, quantity: 1 },
        { id: 2, productId: 2, quantity: 2 }
    ]
    res.json(order)
})

app.listen(port, () => {
    console.log("server berjalan di http://localhost:3000");

})