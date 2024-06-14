import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const {username} = req.params;
   try {
    const user = await User.findOne({username}).select("-password");
    if(!user) {
       return res.status(404).json({error: "User Not Found"})
    }
    res.status(200).json({user})
   } catch (error) {
    console.error("Error in getUserProfile Controller", error.message);
     res.status(500).json({err: "Internal Server Error"})
   }
}


export const suggestUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}


export const followUnFollowUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}


export const updateUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}