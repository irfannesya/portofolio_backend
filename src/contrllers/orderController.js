const { product } = require("../../db")
const prisma = require("../../db")

exports.createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        if (!productId || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ message: "Data tidak valid" })
        }

        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                productId,
                quantity
            }
        })

        res.json(order)
    } catch (error) {
        res.status(500).json({ message: "gagal membuat order" })
    }
}

exports.getOrder = async (req, res) => {
    const order = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
            product: true
        }
    })
    res.json(order)
}