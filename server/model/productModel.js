import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true,
    },
    supplier:{
        type: String,
        required: true
    }
})

export default mongoose.model("Product", productSchema);