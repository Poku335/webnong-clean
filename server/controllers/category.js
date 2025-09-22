const prisma = require("../config/prisma")

exports.create = async(req,res)=>{
    try{
        // code
        const { name, image } = req.body
        const category = await prisma.category.create({
            data:{
                name: name,
                image: image
            }
        })
        res.send(category)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.list = async(req,res)=>{
    try{
        // code
        const category = await prisma.category.findMany()
        res.send(category)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.update = async(req,res)=>{
    try{
        // code
        const { id } = req.params
        const { name, image } = req.body
        const category = await prisma.category.update({
            where:{ 
                id: Number(id)
             },
            data: {
                name: name,
                image: image
            }
        })
        res.send(category)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}

exports.remove = async(req,res)=>{
    try{
        // code
        const { id } = req.params
        const category = await prisma.category.delete({
            where:{ 
                id: Number(id)
             }
        })
        res.send(category)
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}