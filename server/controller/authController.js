import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({message: "Invalid Password"});
        
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(200).json({token, user})
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}