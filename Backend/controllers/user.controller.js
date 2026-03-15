import {User} from "../modules/user.model.js";

const registerUser = async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        // basic validation
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required !"})
        }

        // check if user already exist
        const existing = await User.findOne({email: email.toLowerCase()})
        if(existing){
            return res.status(400).json({message: "User already exists !"})
        }

        // create newUser
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
        });
        res.status(201).json({
            message: "User created successfully",
            user: {id:user._id, email:user.email, username:user.username}
        });
    } catch (error) {
        res.status(500).json({message: "Interal server error", error: error.message});
    }
};

const loginUser = async(req, res) =>{
    try {

        //checking if a user already exists
        const {email, password} = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user) return res.status(400).json({
            message: "User not found"
        });

        // compare passwords
        
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"
        });

        res.status(200).json({
            message: "User Logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
        
    }
};

const logoutUser = async(req, res) =>{
    try {
        const user = await User.findOne({
            email
        });

        if(!user) return res.status(400).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "Logout successfully"
        })
    } catch (error) {

        res.status(500)({
            message: "Internal Server Error", error
        });

        
    }
}

export{
   registerUser,
   loginUser,
   logoutUser
};