const prisma = require("./db")

async function main() {
    const product = await prisma.product.findMany()
    console.log(product);
    
}
main()