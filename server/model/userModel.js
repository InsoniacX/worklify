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
    picture: {
        type: String,
        default: "",
    },
    status: {
        type: Boolean,
        required: true,
        default: false,
    }
})

export default mongoose.model("Users", userSchema);