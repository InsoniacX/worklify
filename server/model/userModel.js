import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address:{
        type: String,
    },
    image: {
        type: String,
        default: "",
    },
})

export default mongoose.model("Users", userSchema);