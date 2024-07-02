import { generateTokenAndSetCookie } from "../lib/utils/generateTokenCookie.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup = async(req,res) => {
     try {
        const {fullname, username, email, password } = req.body;
        // checking email is valid or not. 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            res.status(400).json({error: "Invalid Email Passed by You"})
        } 
        // step2. checking is username is already exist or not
         const userExist = await User.findOne({username});
         if(userExist) {
            return res.status(400).json({error: "Username already exist"})
         }
         // step3. checking is email already exist or not
         const emailExist = await User.findOne({email})
         if(emailExist) {
            return res.status(400).json({error: "Email is Already exist"})
         }

         // step4 checking the lenght of the password
         if(password.length < 6) {
            return res.status(400).json({error: "Password length must be 6 character long"})
         }

         // hashing the password
         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password, salt);

         // after all checks create newUser
         const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword
         })

         // once we have generate a newuser generate token and set to the cookie.

         if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg

            })
         } else{
            res.status(400).json({error: "Invalid User Data"})
         }

     } catch (error) {
        console.log("Error in Signup Controlllers",error.message)
        res.status(500).json({err: "Internal Server Error"})
     }
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body;
   const user = await User.findOne({username})
   const isCorrectPassword = await bcrypt.compare(password, user?.password || "");

   if(!username || !isCorrectPassword) {
      return res.status(400).json({error: "Invalid Username or Password"})
   } 
     
   generateTokenAndSetCookie(user._id, res);

   res.status(200).json({
    _id: user._id,
     fullname: user.fullname,
     username: user.username,
     email: user.email,
     followers: user.followers,
     following: user.following,
     profileImg: user.profileImg,
     coverImg: user.coverImg

   })
    
    } catch (error) {
        console.log("Error in Login Controlllers",error.message)
       res.status(400).json({msg: "Internal Server Error"}) 
    }
   
}

export const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({msg: "Logged out Successfully!!"})
    } catch (error) {
        console.log("Error in Logout Controller", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}



 // get the authenticated User 

 export const authCheck = async (req, res) => {
     try {
       const user = await User.findById(req.user?._id).select("-password");
       res.status(200).json(user)
     } catch (error) {
      console.log("Error in Auth Controller", error.message)
        res.status(500).json({error: "Internal Server Error"})
     }
 }



 