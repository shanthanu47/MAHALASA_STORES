import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        await Product.create({...productData, image: imagesUrl})

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list
export const getAllProducts = async (req, res)=>{
    try {
        const products = await Product.find({})
        console.log("Products fetched from DB:", products);
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Delete Product : /api/product/delete
export const deleteProduct = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Delete images from cloudinary
        if (product.image && product.image.length > 0) {
            await Promise.all(
                product.image.map(async (imageUrl) => {
                    try {
                        const publicId = imageUrl.split('/').pop().split('.')[0]
                        await cloudinary.uploader.destroy(publicId)
                    } catch (err) {
                        console.log("Error deleting image from cloudinary:", err.message)
                    }
                })
            )
        }

        await Product.findByIdAndDelete(id)
        res.json({success: true, message: "Product Deleted Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
