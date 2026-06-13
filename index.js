const express = require("express")
const app = express()
const prisma = require("./db")
const port = 3000

app.use(express.json())

const products = [
    { id: 1, name: "Sabun", harga: 5000 },
    { id: 2, name: "Shampoo", harga: 15000 }
]

app.get("/", (req, res) => {
    res.send("Challenge 10 Product")
})

app.get("/products", (req, res) => {
  const { name, minHarga } = req.query

  let result = products

  if (name) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  if (minHarga) {
    const min = parseInt(minHarga)
    result = result.filter(p => p.harga >= min)
  }

  res.json(result)
})

app.post("/products", (req, res) => {
    const { name, harga } = req.body

    if (!name || name.trim() === "")
        return res.status(400).json({ messages: "nama harus di isi" })

    if (typeof harga !== "number" || harga <= 0)
        return res.status(400).json({ messages: "Harga harus angka dan > 0" })

    const newProduct = {
        id: products.length + 1,
        name,
        harga
    }

    products.push(newProduct)
    console.log("Product Berhasil Di tambahkan");

    res.json(newProduct)

})

app.put("/products/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { name, harga } = req.body

    if (isNaN(id)) {
        return res.status(400).json({ messages: " ID tidak valid" })
    }

    const index = products.findIndex(u => u.id === id)

    if (index === -1) {
        return res.status(404).json({ messages: "barang tidak di temukan" })
    }

    products[index] = {
        id,
        name,
        harga
    }

    res.json({
        messages: " product berhasil di update",
        data: products[index]
    })

})

app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ messages: "User tidak ditemukan" })
    }

    const deleteProduct = products.splice(index, 1)

    res.json({
        messages: " Product berhasil di hapus",
        data: deleteProduct[0]
    })

})

// app.get("/product/filter", (req, res) => {

//     const { name, harga, min, max } = req.query

//     let result = products

//     // filter nama

//     if (name) {
//         result = result.filter(p =>
//             p.name.toLowerCase().includes(name.toLowerCase())
//         )
//     }
//     //filter harga
//     if (harga) {
//         result = result.filter(p => p.harga === harga)
//     }

//     res.json(result)

//     const minHarga = parseInt(req.query.minHarga)

//     if (minHarga) {
//         const result = products.filter(p => p.harga >= minHarga)
//         return res.json(result)
//     }
//     res.json(result)
// })


app.listen(port, () => {
    console.log("server berjalan di http://localhost:3000");

})

