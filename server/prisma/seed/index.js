const prisma = require('../../config/prisma')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

async function main() {
  const categoriesPath = path.join(__dirname, 'categories.json')
  const productsPath = path.join(__dirname, 'products.json')
  const usersPath = path.join(__dirname, 'users.json')

  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

  // Create Users if not exists
  for (const u of users) {
    const exists = await prisma.user.findFirst({ where: { email: u.email }})
    if (!exists) {
      const hashedPassword = await bcrypt.hash(u.password, 10)
      await prisma.user.create({
        data: {
          email: u.email,
          password: hashedPassword,
          name: u.name,
          role: u.role,
          enabled: u.enabled,
          address: u.address
        }
      })
      console.log(`Created user: ${u.email} (${u.role})`)
    }
  }

  // Create Categories if not exists
  for (const c of categories) {
    const exists = await prisma.category.findFirst({ where: { name: c.name }})
    if (!exists) {
      await prisma.category.create({ data: { name: c.name }})
    }
  }

  // Map name -> id
  const dbCategories = await prisma.category.findMany()
  const nameToId = Object.fromEntries(dbCategories.map((c)=> [c.name, c.id]))

  // Create Products if not exists
  for (const p of products) {
    const categoryId = nameToId[p.categoryName]
    if (!categoryId) continue

    const exists = await prisma.product.findFirst({ where: { title: p.title }})
    if (exists) continue

    const created = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
        categoryId,
      }
    })

    if (p.imageUrls && p.imageUrls.length) {
      // ถ้ามีรูป ให้บันทึกเป็น Image records
      await prisma.image.createMany({
        data: p.imageUrls.map((url)=> ({
          asset_id: `seed-${Date.now()}`,
          public_id: `seed-${Date.now()}`,
          url,
          secure_url: url,
          productId: created.id,
        }))
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed completed')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


