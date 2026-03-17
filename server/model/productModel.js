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
    quantity:{
        type: Number,
        required: true,
    },
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    sender:{
        type: String,
        required: true
    }
})

export default mongoose.model("Product", productSchema);