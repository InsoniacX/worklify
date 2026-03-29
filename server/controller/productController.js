import { request } from "express";
import Product from "../model/productModel.js"

/**
 * Fetch All Product Data from the Database
 * METHOD = GET
 * URI = http://localhost:8080/api/product 
 */
export const fetchAll = async(req, res) => {
    try {
        const { name, category, stock, page = 1, limit = 5 } = req.query;

        const query = {};

        if (name) query.name = { $regex: name, $options: "i" }
        if (category) query.category = { $regex: category, $options: "i" }
        if (stock === "low" ) query.stock = { $lte: 10 };
        if (stock === "high" ) query.stock = { $gt: 10 };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(query);
        const data = await Product.find(query).skip(skip).limit(Number(limit)); 

        res.status(200).json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/** 
 * Fetch Last 5 Products that has been Added
 * METHOD = GET
 * URI = http://localhost:8080/api/product/latest
 */
export const latestProduct = async(req, res) => {
    try {
        const product = await Product.find()
        .sort({ _id: -1 })
        .limit(5);
        
        res.status(200).json(product);
    } catch(error) {
        res.status(500).json({error:error.message});
    } 
}

/**
 * Create a Product Data and Put it in the Database
 * METHOD = POST
 * URI = http://localhost:8080/api/product/
 */
export const createProduct = async(req, res) => {
    try {
    const { name, brand, category, stock, supplier } = req.body;

    if (!name || !brand || !category || !stock || !supplier) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Stock must be a valid positive number" });
    }

    const productExist = await Product.findOne({ name, supplier });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists from this supplier" });
    }

    const newProduct = new Product({ name, brand, category, stock, supplier });
    const savedData = await newProduct.save();
        res.status(200).json(savedData);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Update Product Data
 * METHOD = PATCH
 * URI = http://localhost:8080/api/product/:id 
 */
export const updateProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({message: "Product Not Found"});
        }

        const updatedProduct = await Product.findByIdAndUpdate(product, req.body, {
            new:true
        });

        res.status(200).json(updatedProduct);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Find the Product by using ID from the URL
 * METHOD = GET
 * URI = http://localhost:8080/api/product/:id
 */
export const fetchById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if(!product) {
            res.status(404).json({message: "Product not Found"})
        }

        res.status(200).json(product)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Delete data from the Database
 * METHOD = DELETE
 * URI = http://localhost:8080/api/product/:id
 */
export const removeProduct = async(req, res) => {
    try {
        const productId = await Product.findById(req.params.id);

        if(!productId) {
            res.status(404).json({message: "Product not Found"})
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Data has been Deleted"})

    } catch(error) {
        res.status(500).json({error: error.message})
    }
}