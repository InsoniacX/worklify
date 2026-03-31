import bcrypt from "bcryptjs";
import User from "../model/userModel.js";

/**
 * Fetch all users Data
 * METHOD: GET
 * URI: http://localhost:8080/api/user
 */
export const fetchAll = async(req, res) => {
    try {
        const { name, email, page = 1, limit = 5 } = req.query;

        const query = {};

        if (name) query.name = { $regex: name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(query);
        const data = await User.find(query).skip(skip).limit(Number(limit))
        
        res.status(200).json({
            data, 
            total, 
            page: Number(page), 
            limit: Number(limit), 
            totalPages: Math.ceil(total / Number(limit))
        });
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
        const data = await User.findById(req.params.id)

        res.status(200).json(data)
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

/**
 * Create user Data
 * METHOD: POST
 * URI: http://localhost:8080/api/user
 */
export const createUser = async(req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || !email || !password || !address) {
          return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
        });

        const savedData = await newUser.save();
        res.status(200).json(savedData)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Update user Data
 * METHOD: PATCH
 * URI: http://localhost:8080/api/user/:id
 */
export const updateUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
           return res.status(404).json({message: "User didn't exist"});
        }

        const { password, ...rest } = req.body;

        const updatedData = { ...rest }

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

/**
 * Show the Create User Page
 * METHOD: GET
 * URI: http://localhost:8080/api/user/new
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
 * URI: http://localhost:8080/api/user/:id
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

/**
 * GET User Count
 * METHOD: GET
 * URI: http://locahost:8080/api/user/count
 */
export const countUser = async(req, res) => {
try {
    const now = new Date();
    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const objectIdFromDate = (date) => {
      return Math.floor(date.getTime() / 1000).toString(16).padStart(8, '0') + '0000000000000000';
    };

    const totalCount = await User.countDocuments();
    const thisMonthCount = await User.countDocuments({
      _id: { $gte: objectIdFromDate(startOfMonth) }
    });
    const lastMonthCount = await User.countDocuments({
      _id: {
        $gte: objectIdFromDate(startOfLastMonth),
        $lt:  objectIdFromDate(startOfMonth),
      }
    });

    const delta = lastMonthCount === 0
      ? 100
      : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

    res.status(200).json({ count: totalCount, delta, deltaUp: delta >= 0 });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Profile Picture Upload Controller
 * METHOD: POST
 * URI: http://localhost:8080/api/uploads/:id/avatar
 */

export const uploadAvatar = async ( req, res ) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "No file uploaded "});
        }

        const pictureUrl = `http://localhost:8080/uploads/${req.file.filename}`;

        const updateUser = await User.findByIdAndUpdate( 
            req.params.id, 
            { picture: pictureUrl }, 
            { new: true } 
        );

        if (!updateUser) {
            return res.status(404).json({ message: "User not found "});
        }

        const { password: _, ...userWithoutPassword } = updateUser.toObject();
        res.status(200).json(userWithoutPassword);
    } catch(err){
        res.status(500).json({error: err.message});
    } 
};

/**
 * 
 */