import { request } from "express";
import Product from "../model/productModel.js"

/**
 * Fetch All Product Data from the Database
 * METHOD = GET
 * URI = http://localhost:8080/api/product 
 */
export const fetchAll = async(req, res) => {
    try {
        const data = await Product.find({})

        res.status(200).json(data);
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
        const newProduct = new Product(req.body);
        const { name, sender } = newProduct

        const productExist = await Product.findOne({name, sender})
        if (productExist) {
            return res.status(400).json({message: "Product has been sent please wait until our next report"})
        }
        const savedData = await newProduct.save();
        res.status(200).json(savedData);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Update Product Data
 * METHOD = GET
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