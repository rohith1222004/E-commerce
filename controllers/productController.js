const Product = require("../models/Product")

const getProduct = async(req, res) => {
    const id = req.params.id
    if(!id){
        const products = await Product.find()
        return res.status(200).send(products);
    }
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send(product); 
    res.send(product)
}

const createProduct = async(req,res) =>{
    const {name,price,description} = req.body
    const product = new Product({
        name,
        price,
        description
    })
    await product.save()
    return res.send(product)
}

module.exports = {
    getProduct,
    createProduct
}