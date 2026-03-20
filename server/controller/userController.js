import { request } from "express";
import User from "../model/userModel.js";

/**
 * Fetch all users Data
 * METHOD: GET
 * URI: http://localhost:8080/api/user
 */
export const fetchAll = async(req, res) => {
    try {
        const data = await User.find({})
        
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Fetch last 5 users that just Stored
 * METHOD: GET
 * URI: http://localhost:8080/api/user/recent
 */
export const fetchRecent = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ _id: -1 })
      .limit(5);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch user Data by ID
 * METHOD: GET
 * URI: http://localhost:8080/api/user/:id
 */
export const fetchById = async(req, res) => {
    try { 
        console.log("AWAS LU NGENTOT...")
        const data = await User.findById(req.params.id)

        res.status(200).json(data)
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

/**
 * Create user Data
 * METHOD: POST
 * URI: http://localhost:8080/user
 */
export const createUser = async(req, res) => {
    try {
        const newUser = new User(req.body);
        const { email } = newUser;

        const userExist = await User.findOne({email})
        if (userExist) {
            return res.status(400).json({message: "User already exist"})
        } 
        const savedData = await newUser.save();
        res.status(200).json(savedData)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Update user Data
 * METHOD: PATCH
 * URI: http://localhost:8080/user/:id
 */
export const updateUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        console.log(user)
        if (!user) {
            res.status(404).json({message: "User not Found"});
        }
        console.log(`User Found with id: ${user._id}`)
        const updatedUser = await User.findByIdAndUpdate(user, req.body, {
            new: true
        })
        
        res.status(200).json(updatedUser)
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

/**
 * Show the Create User Page
 * METHOD: GET
 * URI: http://localhost:8080/user/new
 */
export const createPage = async(req, res) => {
    try {

    } catch(error) {
        res.status(404).json({error: error.message})
    }
}

/**
 * DELETE user data
 * METHOD: DELETE
 * URI: http://localhost:8080/user/:id
 */
export const removeUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not Found"})
        }
        
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json(user)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}